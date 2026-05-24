namespace AutoPartsShop.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "New";
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }
        public bool IsReminderSet { get; set; }
        public DateTime? ReminderDate { get; set; }
        
        public Customer? Customer { get; set; }
        public User? User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
    
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int PartId { get; set; }
        public int Quantity { get; set; }
        public decimal PriceAtOrder { get; set; }
        public decimal TotalPrice { get; set; }  // Обычное поле, не вычисляемое
        
        public Order? Order { get; set; }
        public Part? Part { get; set; }
    }
    
    public class CustomerInteraction
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int UserId { get; set; }
        public DateTime InteractionDate { get; set; } = DateTime.Now;
        public string Type { get; set; } = "Call";
        public string? Topic { get; set; }
        public string? Result { get; set; }
        public string? Notes { get; set; }
        public DateTime? FollowUpDate { get; set; }
        
        public Customer? Customer { get; set; }
        public User? User { get; set; }
    }
    
    public class Reminder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? CustomerId { get; set; }
        public int? OrderId { get; set; }
        public string ReminderText { get; set; } = string.Empty;
        public DateTime ReminderDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public User? User { get; set; }
        public Customer? Customer { get; set; }
        public Order? Order { get; set; }
    }
}