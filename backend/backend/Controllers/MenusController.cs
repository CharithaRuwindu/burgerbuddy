﻿using backend.Data;
using backend.Models;
using backend.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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
            var allMenus = dbContext.Menus.Select(menu=>new GetItemsDto
            {
                Menu_ID = menu.Menu_ID,
                Name = menu.Name,
                Category = menu.Category,
                Price = menu.Price,
                IsAvailable = menu.IsAvailable,
                IsActive = menu.IsActive,
                ItemImage = menu.ItemImage != null ? Convert.ToBase64String(menu.ItemImage) : null
            }).ToList();

            return Ok(allMenus);
        }

        [HttpPost]
        public async Task<IActionResult> AddItem(AddItemDto addItemDto)
        {
            byte[] imageBytes;
            using (var memoryStream = new MemoryStream())
            {
                await addItemDto.ItemImage.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }

            var itemEntity = new Menu()
            {
                Name = addItemDto.Name,
                Category = addItemDto.Category,
                Price = addItemDto.Price,
                IsAvailable = addItemDto.IsAvailable,
                IsActive = addItemDto.IsActive,
                ItemImage = imageBytes,
            };

            dbContext.Menus.Add(itemEntity);
            await dbContext.SaveChangesAsync();

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

        [HttpGet("items")]
public IActionResult GetItemsByIds([FromQuery] string ids)
{
    if (string.IsNullOrWhiteSpace(ids))
    {
        return BadRequest("The 'ids' parameter is required.");
    }

    try
    {
        var idList = ids.Split(',').Select(Guid.Parse).ToList();

        // Example: Query database with the parsed GUIDs
        var items = dbContext.Menus.Where(menu => idList.Contains(menu.Menu_ID)).ToList();

        if (!items.Any())
        {
            return NotFound("No items found for the provided IDs.");
        }

        return Ok(items);
    }
    catch (Exception ex)
    {
        return BadRequest($"Invalid 'ids' parameter: {ex.Message}");
    }
}

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateItems(Guid id, UpdateItemsDto updateItemsDto)
        {
            var item = dbContext.Menus.Find(id);
            if(item is null)
            {
                return NotFound();
            }

            byte[] imageBytes;

            using (var memoryStream = new MemoryStream())
            {
                await updateItemsDto.ItemImage.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }

            item.Name = updateItemsDto.Name;
            item.Category = updateItemsDto.Category;
            item.Price = updateItemsDto.Price;
            item.IsAvailable = updateItemsDto.IsAvailable;
            item.IsActive = updateItemsDto.IsActive;
            item.ItemImage = imageBytes;

            await dbContext.SaveChangesAsync();

            return Ok(item);
        }

        [HttpPatch]
        [Route("{id:guid}/deactivate")]
        public IActionResult DeactivateItem(Guid id)
        {
            var menu = dbContext.Menus.Find(id);
            if (menu == null)
            {
                return NotFound($"Item with ID {id} not found.");
            }

            menu.IsActive = false;

            dbContext.SaveChanges();

            return Ok(new { message = $"Item with ID {id} has been deactivated." });
        }

        [HttpPatch]
        [Route("{id:guid}/reactivate")]
        public IActionResult ReactivateItem(Guid id)
        {
            var menu = dbContext.Menus.Find(id);
            if (menu == null)
            {
                return NotFound($"Item with ID {id} not found.");
            }

            menu.IsActive = true;

            dbContext.SaveChanges();

            return Ok(new { message = $"Item with ID {id} has been reactivated." });
        }

        [HttpPatch]
        [Route("{id:guid}/makeunavailable")]
        public IActionResult UnavailableItem(Guid id)
        {
            var menu = dbContext.Menus.Find(id);
            if (menu == null)
            {
                return NotFound($"Item with ID {id} not found.");
            }

            menu.IsAvailable = false;

            dbContext.SaveChanges();

            return Ok(new { message = $"Item with ID {id} has been made unavailable." });
        }

        [HttpPatch]
        [Route("{id:guid}/makeavailable")]
        public IActionResult AvailableItem(Guid id)
        {
            var menu = dbContext.Menus.Find(id);
            if (menu == null)
            {
                return NotFound($"Item with ID {id} not found.");
            }

            menu.IsAvailable = true;

            dbContext.SaveChanges();

            return Ok(new { message = $"Item with ID {id} has been made available." });
        }
    }
}
