namespace AutoPartsShop.API.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? CarModel { get; set; }
        public int? CarYear { get; set; }
        public string? VIN { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? CreatedBy { get; set; }
        
        // Навигационные свойства
        public User? Creator { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<CustomerInteraction> Interactions { get; set; } = new List<CustomerInteraction>();
    }
}