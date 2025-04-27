using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using backend.Data;
using backend.Models.Entities;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IPasswordService _passwordService;
        private readonly IConfiguration _configuration;

        public AuthController(
            ApplicationDbContext dbContext,
            IPasswordService passwordService,
            IConfiguration configuration)
        {
            _dbContext = dbContext;
            _passwordService = passwordService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user by email
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null)
            {
                // Use a generic error message to prevent username enumeration
                return Unauthorized(new { message = "Invalid credentials" });
            }

            // Verify password
            bool isPasswordValid = _passwordService.VerifyPassword(request.Password, user.Hashedpassword);
            if (!isPasswordValid)
            {
                // Use a generic error message to prevent username enumeration
                return Unauthorized(new { message = "Invalid credentials" });
            }

            // Password is valid, create tokens
            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();

            // Save refresh token to database
            var userRefreshToken = new UserRefreshToken
            {
                UserId = user.User_ID,
                Token = refreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(7), // 7 days expiry
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.UserRefreshTokens.Add(userRefreshToken);
            await _dbContext.SaveChangesAsync();

            // Update last login time (optional)
            user.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            // Return the tokens
            return Ok(new
            {
                accessToken,
                refreshToken,
                expiresIn = 3600, // 1 hour in seconds
                user = new
                {
                    userId = user.User_ID,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    role = user.Role.ToString()
                }
            });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest("Refresh token is required");
            }

            // Find the refresh token in the database
            var refreshToken = await _dbContext.UserRefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt =>
                    rt.Token == request.RefreshToken &&
                    !rt.IsRevoked &&
                    rt.ExpiryDate > DateTime.UtcNow);

            if (refreshToken == null)
            {
                return Unauthorized("Invalid refresh token");
            }

            // Check if the user is still active
            if (!refreshToken.User.IsActive)
            {
                return Unauthorized("User account is inactive");
            }

            // Generate new tokens
            var newAccessToken = GenerateAccessToken(refreshToken.User);
            var newRefreshToken = GenerateRefreshToken();

            // Revoke the old refresh token
            refreshToken.IsRevoked = true;

            // Save new refresh token
            var userRefreshToken = new UserRefreshToken
            {
                UserId = refreshToken.UserId,
                Token = newRefreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(7), // 7 days expiry
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.UserRefreshTokens.Add(userRefreshToken);
            await _dbContext.SaveChangesAsync();

            // Return the new tokens
            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken,
                expiresIn = 3600 // 1 hour in seconds
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest("Refresh token is required");
            }

            // Find and revoke the refresh token
            var refreshToken = await _dbContext.UserRefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && !rt.IsRevoked);

            if (refreshToken != null)
            {
                refreshToken.IsRevoked = true;
                await _dbContext.SaveChangesAsync();
            }

            return Ok(new { message = "Logged out successfully" });
        }

        #region Helper Methods
        private string GenerateAccessToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.User_ID.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
        new Claim(ClaimTypes.Role, user.Role.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            Console.WriteLine($"Generated token: {tokenString.Substring(0, Math.Min(20, tokenString.Length))}...");
            Console.WriteLine($"Token parts: {tokenString.Split('.').Length}");

            return tokenString;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        #endregion
    }

    #region Request DTOs
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; }
    }

    public class LogoutRequest
    {
        [Required]
        public string RefreshToken { get; set; }
    }
    #endregion
}