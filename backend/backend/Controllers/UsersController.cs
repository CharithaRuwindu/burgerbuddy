using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using backend.Data;
using backend.Models.Entities;
using backend.Services;
using backend.Models;

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

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = dbContext.Users.ToList();
            return Ok(users);
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