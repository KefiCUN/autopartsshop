using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Services;

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
                p.RetailPrice,
                p.StockQuantity,
                p.ImageUrl,
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
    }
    
    public class UpdateStockModel
    {
        public int StockQuantity { get; set; }
    }
    
    public class UpdatePriceModel
    {
        public decimal RetailPrice { get; set; }
    }
}