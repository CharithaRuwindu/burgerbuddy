using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using backend.Data;
using backend.Models.Entities;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public UsersController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // GET: api/Users
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = dbContext.Users.ToList();
            return Ok(users);
        }

        // GET: api/Users/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetUserById(int id)
        {
            var user = dbContext.Users.Find(id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public IActionResult AddUser(AddUserDto userDto)
        {
            // Create a new user entity
            var user = new User()
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Hashedpassword = userDto.Hashedpassword,
                ContactNumber = userDto.ContactNumber,
                Address = userDto.Address,
                RoleId = userDto.RoleId,
                IsActive = userDto.IsActive
            };

            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetUserById), new { User_ID = user.User_ID }, user);
        }
    }
}
