using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    //localhost:xxx/api/menus
    [Route("api/[controller]")]
    [ApiController]
    public class MenusController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public MenusController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet]
        public IActionResult GetMenus()
        {
            var allMenus = dbContext.Menus.ToList();

            return Ok(allMenus);
        }

        [HttpPost]
        public IActionResult AddItem(AddItemDto addItemDto)
        {
            var itemEntity = new Menu()
            {
                Name = addItemDto.Name,
                Category = addItemDto.Category,
                Price = addItemDto.Price,
                IsActive = addItemDto.IsActive,
            };
            dbContext.Menus.Add(itemEntity);
            dbContext.SaveChanges();

            return Ok(itemEntity);
        }
    }
}
