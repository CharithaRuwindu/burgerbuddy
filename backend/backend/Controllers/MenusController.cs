﻿using backend.Data;
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
                IsAvailable = addItemDto.IsAvailable,
                IsActive = addItemDto.IsActive,
            };
            dbContext.Menus.Add(itemEntity);
            dbContext.SaveChanges();

            return Ok(itemEntity);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetItemById(Guid id)
        {
            var item = dbContext.Menus.Find(id);

            if(item is null)
            {
                return NotFound();
            }
            else
            {
                return Ok(item);
            }
        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateItems(Guid id, UpdateItemsDto updateItemsDto)
        {
            var item = dbContext.Menus.Find(id);
            if(item is null)
            {
                return NotFound();
            }

            item.Name = updateItemsDto.Name;
            item.Category = updateItemsDto.Category;
            item.Price = updateItemsDto.Price;
            item.IsAvailable = updateItemsDto.IsAvailable;
            item.IsActive = updateItemsDto.IsActive;

            dbContext.SaveChanges();

            return Ok(item);
        }
    }
}