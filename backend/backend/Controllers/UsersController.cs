using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using backend.Data;
using backend.Models.Entities;
using backend.Services;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        private readonly IPasswordService passwordService;

        public UsersController(ApplicationDbContext dbContext, IPasswordService passwordService)
        {
            this.dbContext = dbContext;
            this.passwordService = passwordService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            var userIdentity = User.Identity;
            var isAuthenticated = userIdentity?.IsAuthenticated ?? false;
            var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            Console.WriteLine($"User authenticated: {isAuthenticated}");
            Console.WriteLine($"User roles: {string.Join(", ", roles)}");
            Console.WriteLine($"Is in Admin role: {User.IsInRole("Admin")}");

            var users = dbContext.Users.ToList();
            var usersDto = users.Select(user => new GetUserDto
            {
                User_ID = user.User_ID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                ContactNumber = user.ContactNumber,
                Address = user.Address,
                IsActive = user.IsActive,
                Role = user.Role
            }).ToList();

            foreach (var userDto in usersDto)
            {
                Console.WriteLine($"User ID: {userDto.User_ID}");
                Console.WriteLine($"Name: {userDto.FirstName} {userDto.LastName}");
                Console.WriteLine($"Email: {userDto.Email}");
                Console.WriteLine($"Contact: {userDto.ContactNumber}");
                Console.WriteLine($"Address: {userDto.Address}");
                Console.WriteLine($"Active: {userDto.IsActive}");
                Console.WriteLine($"Role: {userDto.Role}");
                Console.WriteLine("----------------------------");
            }

            return Ok(usersDto);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetUserById(Guid id)
        {
            var user = dbContext.Users.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult AddUser(AddUserDto userDto)
        {
            if (!IsValidEmail(userDto.Email))
            {
                return BadRequest("Invalid email format.");
            }

            if (dbContext.Users.Any(u => u.Email == userDto.Email))
            {
                return BadRequest("Email already exists in the system.");
            }

            if (dbContext.Users.Any(u => u.ContactNumber == userDto.ContactNumber))
            {
                return BadRequest("Contact number already exists in the system.");
            }

            if (!Enum.TryParse<UserRole>(userDto.Role, true, out var userRole))
            {
                return BadRequest("Invalid role. Role must be Admin, Manager, or Customer.");
            }

            if (!IsStrongPassword(userDto.Password))
            {
                return BadRequest("Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.");
            }

            var user = new User()
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Hashedpassword = "",
                ContactNumber = userDto.ContactNumber,
                Address = userDto.Address,
                Role = userRole,
                IsActive = userDto.IsActive
            };

            passwordService.SetPasswordForUser(user, userDto.Password);

            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetUserById), new { id = user.User_ID }, user);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateUser(Guid id, UpdateUserDto userDto)
        {
            var user = dbContext.Users.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            if (userDto.Email != user.Email && dbContext.Users.Any(u => u.Email == userDto.Email))
            {
                return BadRequest("Email already exists in the system.");
            }

            if (userDto.ContactNumber != user.ContactNumber && dbContext.Users.Any(u => u.ContactNumber == userDto.ContactNumber))
            {
                return BadRequest("Contact number already exists in the system.");
            }

            if (!IsValidEmail(userDto.Email))
            {
                return BadRequest("Invalid email format.");
            }

            if (!Enum.TryParse<UserRole>(userDto.Role, true, out var userRole))
            {
                return BadRequest("Invalid role. Role must be Admin, Manager, or Customer.");
            }

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.Email = userDto.Email;
            user.ContactNumber = userDto.ContactNumber;
            user.Address = userDto.Address;
            user.Role = userRole;
            user.IsActive = userDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            dbContext.SaveChanges();

            return Ok(user);
        }

        [HttpPatch]
        [Route("{id:guid}/deactivate")]
        public IActionResult DeactivateUser(Guid id)
        {
            var user = dbContext.Users.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            dbContext.SaveChanges();

            return Ok(new { message = $"User with ID {id} has been deactivated." });
        }

        [HttpPatch]
        [Route("{id:guid}/reactivate")]
        public IActionResult ReactivateUser(Guid id)
        {
            var user = dbContext.Users.Find(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;

            dbContext.SaveChanges();

            return Ok(new { message = $"User with ID {id} has been reactivated." });
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsStrongPassword(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8)
                return false;

            if (!password.Any(char.IsUpper))
                return false;

            if (!password.Any(char.IsLower))
                return false;

            if (!password.Any(char.IsDigit))
                return false;

            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                return false;

            return true;
        }
    }
}