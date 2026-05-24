using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Models;

namespace AutoPartsShop.API.Services
{
    public class PartSearchService
    {
        private readonly ApplicationDbContext _context;
        
        public PartSearchService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<List<Part>> SearchPartsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return new List<Part>();
            
            searchTerm = searchTerm.ToLower().Trim();
            
            // Ищем по артикулу, названию и бренду (убираем совместимость для простоты)
            var parts = await _context.Parts
                .Where(p => 
                    p.ArticleNumber.ToLower().Contains(searchTerm) ||
                    p.Name.ToLower().Contains(searchTerm) ||
                    (p.Brand != null && p.Brand.ToLower().Contains(searchTerm))
                )
                .OrderBy(p => p.StockQuantity > 0 ? 0 : 1)
                .ThenBy(p => p.Name)
                .Take(50)
                .ToListAsync();
            
            return parts;
        }
        
        public async Task<List<Part>> GetAnaloguesAsync(int partId)
        {
            var analogueIds = await _context.PartAnalogues
                .Where(pa => pa.PartId == partId)
                .Select(pa => pa.AnaloguePartId)
                .ToListAsync();
            
            return await _context.Parts
                .Where(p => analogueIds.Contains(p.Id))
                .OrderByDescending(p => p.StockQuantity)
                .ThenBy(p => p.RetailPrice)
                .ToListAsync();
        }
    }
}