namespace AutoPartsShop.API.Models
{
    public class Part
    {
        public int Id { get; set; }
        public string ArticleNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public string? Description { get; set; }
        public decimal? PurchasePrice { get; set; }
        public decimal RetailPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinStockQuantity { get; set; } = 3;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        
        public ICollection<PartAnalogue> Analogues { get; set; } = new List<PartAnalogue>();
        public ICollection<PartCompatibility> Compatibilities { get; set; } = new List<PartCompatibility>();
    }
    
    public class PartAnalogue
    {
        public int Id { get; set; }
        public int PartId { get; set; }
        public int AnaloguePartId { get; set; }
        public string? Notes { get; set; }
        
        public Part? Part { get; set; }
        public Part? AnaloguePart { get; set; }
    }
    
    public class PartCompatibility
    {
        public int Id { get; set; }
        public int PartId { get; set; }
        public string? CarBrand { get; set; }
        public string? CarModel { get; set; }
        public int? CarYearFrom { get; set; }
        public int? CarYearTo { get; set; }
        public string? Engine { get; set; }
        public string? Notes { get; set; }
        
        public Part? Part { get; set; }
    }
}