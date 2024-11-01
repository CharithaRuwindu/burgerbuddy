using backend.Data;
using backend.Models;
using backend.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Models
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public UserController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet]
        public IActionResult GetUser()
        {

            var allUser = dbContext.Users.Select(user => new GetUserDto
            {
                User_ID = user.User_ID,
                firstName = user.firstName,
                lastName = user.lastName,
                email = user.email,
                hashedpassword = user.hashedpassword,
                contactNumber = user.contactNumber,
                address = user.address
            }).ToList();
            return Ok(allUser);
        }
    }
}
