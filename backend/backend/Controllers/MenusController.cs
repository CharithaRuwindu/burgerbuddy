using backend.Data;
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
    }
}
