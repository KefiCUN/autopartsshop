using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Models;
using AutoPartsShop.API.Services;
using System.IO;

namespace AutoPartsShop.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PartsController : ControllerBase
    {
        private readonly PartSearchService _searchService;
        private readonly ApplicationDbContext _context;
        
        public PartsController(PartSearchService searchService, ApplicationDbContext context)
        {
            _searchService = searchService;
            _context = context;
        }
        
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest(new { message = "Введите поисковый запрос" });
            
            var parts = await _searchService.SearchPartsAsync(term);
            
            var result = parts.Select(p => new
            {
                p.Id,
                p.ArticleNumber,
                p.Name,
                p.Brand,
                p.ImageUrl,
                p.RetailPrice,
                p.StockQuantity,
                StockStatus = p.StockQuantity == 0 ? "OutOfStock" :
                              p.StockQuantity <= p.MinStockQuantity ? "LowStock" : "InStock"
            });
            
            return Ok(result);
        }
        
        [HttpGet("{id}/analogues")]
        public async Task<IActionResult> GetAnalogues(int id)
        {
            var originalPart = await _context.Parts.FindAsync(id);
            if (originalPart == null)
                return NotFound(new { message = "Запчасть не найдена" });
            
            var analogues = await _searchService.GetAnaloguesAsync(id);
            
            var result = analogues.Select(a => new
            {
                a.Id,
                a.ArticleNumber,
                a.Name,
                a.Brand,
                a.ImageUrl,
                a.RetailPrice,
                a.StockQuantity,
                SavingsPercent = originalPart.RetailPrice > 0 
                    ? Math.Round(((originalPart.RetailPrice - a.RetailPrice) / originalPart.RetailPrice) * 100, 1)
                    : 0
            });
            
            return Ok(new
            {
                OriginalPart = new { originalPart.Id, originalPart.Name, originalPart.Brand, originalPart.RetailPrice },
                Analogues = result
            });
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllParts()
        {
            var parts = await _context.Parts
                .OrderBy(p => p.Name)
                .Select(p => new
                {
                    p.Id,
                    p.ArticleNumber,
                    p.Name,
                    p.Brand,
                    p.ImageUrl,
                    p.RetailPrice,
                    p.StockQuantity,
                    StockStatus = p.StockQuantity == 0 ? "OutOfStock" :
                                  p.StockQuantity <= p.MinStockQuantity ? "LowStock" : "InStock"
                })
                .ToListAsync();
            
            return Ok(parts);
        }
        
        [HttpGet("lowstock")]
        public async Task<IActionResult> GetLowStock()
        {
            var parts = await _context.Parts
                .Where(p => p.StockQuantity <= p.MinStockQuantity && p.StockQuantity > 0)
                .OrderBy(p => p.StockQuantity)
                .Select(p => new
                {
                    p.Id,
                    p.ArticleNumber,
                    p.Name,
                    p.Brand,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.MinStockQuantity
                })
                .ToListAsync();
            
            return Ok(parts);
        }
        
        // Обновить остаток — только Admin
        [HttpPut("{id}/stock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockModel model)
        {
            var part = await _context.Parts.FindAsync(id);
            if (part == null)
                return NotFound(new { message = "Запчасть не найдена" });
            
            part.StockQuantity = model.StockQuantity;
            part.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Остаток обновлен", stockQuantity = part.StockQuantity });
        }
        
        // Обновить цену — только Admin
        [HttpPut("{id}/price")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePrice(int id, [FromBody] UpdatePriceModel model)
        {
            var part = await _context.Parts.FindAsync(id);
            if (part == null)
                return NotFound(new { message = "Запчасть не найдена" });
            
            part.RetailPrice = model.RetailPrice;
            part.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Цена обновлена", retailPrice = part.RetailPrice });
        }

        // Создать запчасть — только Admin
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreatePartModel model, IFormFile? image)
        {
            if (string.IsNullOrWhiteSpace(model.ArticleNumber) || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Артикул и наименование обязательны" });

            string? imageUrl = model.ImageUrl;

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/{uniqueFileName}";
            }

            var part = new Part
            {
                ArticleNumber = model.ArticleNumber,
                Name = model.Name,
                Brand = model.Brand,
                ImageUrl = imageUrl,
                RetailPrice = model.RetailPrice,
                StockQuantity = model.StockQuantity,
                MinStockQuantity = model.MinStockQuantity,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Parts.Add(part);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Запчасть создана", part });
        }

        // Удалить запчасть — только Admin
        // Удалить запчасть — только Admin
[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> Delete(int id)
{
    var part = await _context.Parts
        .Include(p => p.Analogues)
        .Include(p => p.Compatibilities)
        .FirstOrDefaultAsync(p => p.Id == id);
    
    if (part == null)
        return NotFound(new { message = "Запчасть не найдена" });

    // Удаляем связанные позиции в заказах (через SQL, так как нет прямой связи в модели)
    var orderItems = await _context.OrderItems.Where(oi => oi.PartId == id).ToListAsync();
    _context.OrderItems.RemoveRange(orderItems);
    
    // Сначала сохраняем удаление позиций
    await _context.SaveChangesAsync();

    // Удаляем аналоги
    _context.PartAnalogues.RemoveRange(part.Analogues);

    // Удаляем совместимости
    _context.PartCompatibilities.RemoveRange(part.Compatibilities);

    // Удаляем запчасть
    _context.Parts.Remove(part);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Запчасть удалена" });
}}
    
    public class UpdateStockModel
    {
        public int StockQuantity { get; set; }
    }
    
    public class UpdatePriceModel
    {
        public decimal RetailPrice { get; set; }
    }

    public class CreatePartModel
    {
        public string ArticleNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? ImageUrl { get; set; }
        public decimal RetailPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinStockQuantity { get; set; } = 3;
    }
}