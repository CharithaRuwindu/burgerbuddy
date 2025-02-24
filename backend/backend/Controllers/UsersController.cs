﻿using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using backend.Data;
using backend.Models.Entities;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        // POST: api/Users
        [HttpPost]
        public IActionResult AddUser(AddUserDto userDto)
        {
            if (!Enum.TryParse<UserRole>(userDto.Role, true, out var userRole))
            {
                return BadRequest("Invalid role. Role must be Admin, Manager, or Customer.");
            }
            // Create a new user entity
            var user = new User()
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Hashedpassword = userDto.Hashedpassword,
                ContactNumber = userDto.ContactNumber,
                Address = userDto.Address,
                Role = userRole,
                IsActive = userDto.IsActive
            };

            dbContext.Users.Add(user);
            dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetUserById), new { User_ID = user.User_ID }, user);
        }
    }
}
