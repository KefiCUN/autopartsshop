using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Models;

namespace AutoPartsShop.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // Создать заказ — доступно всем ролям
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderModel model)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(model.CustomerId);
                if (customer == null)
                    return NotFound(new { message = "Клиент не найден" });
                
                var orderNumber = $"ORD-{DateTime.Now:yyyyMMddHHmmss}";
                var order = new Order
                {
                    OrderNumber = orderNumber,
                    CustomerId = model.CustomerId,
                    UserId = model.UserId,
                    Status = "New",
                    OrderDate = DateTime.Now,
                    TotalAmount = 0
                };
                
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                
                decimal totalAmount = 0;
                
                foreach (var item in model.Items)
                {
                    var part = await _context.Parts.FindAsync(item.PartId);
                    if (part == null)
                        return NotFound(new { message = $"Запчасть ID {item.PartId} не найдена" });
                    
                    if (part.StockQuantity < item.Quantity)
                        return BadRequest(new { message = $"Недостаточно '{part.Name}'. В наличии: {part.StockQuantity}" });
                    
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        PartId = item.PartId,
                        Quantity = item.Quantity,
                        PriceAtOrder = part.RetailPrice,
                        TotalPrice = item.Quantity * part.RetailPrice
                    };
                    
                    _context.OrderItems.Add(orderItem);
                    totalAmount += item.Quantity * part.RetailPrice;
                    part.StockQuantity -= item.Quantity;
                }
                
                order.TotalAmount = totalAmount;
                await _context.SaveChangesAsync();
                
                return Ok(new
                {
                    message = "Заказ успешно создан",
                    order = new
                    {
                        order.Id,
                        order.OrderNumber,
                        order.TotalAmount,
                        order.Status,
                        order.OrderDate
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        
        // Получить все заказы — доступно всем ролям
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .Take(50)
                .Select(o => new
                {
                    o.Id,
                    o.OrderNumber,
                    CustomerName = o.Customer.FullName,
                    o.Status,
                    o.TotalAmount,
                    o.OrderDate,
                    ItemsCount = o.OrderItems.Count
                })
                .ToListAsync();
            
            return Ok(orders);
        }
        
        // Получить заказ по ID — доступно всем ролям
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Part)
                .FirstOrDefaultAsync(o => o.Id == id);
            
            if (order == null)
                return NotFound();
            
            return Ok(new
            {
                order.Id,
                order.OrderNumber,
                order.OrderDate,
                order.Status,
                order.TotalAmount,
                Customer = new
                {
                    order.Customer.FullName,
                    order.Customer.Phone,
                    order.Customer.Email,
                    order.Customer.CarModel
                },
                Items = order.OrderItems.Select(oi => new
                {
                    PartName = oi.Part.Name,
                    PartBrand = oi.Part.Brand,
                    PartArticle = oi.Part.ArticleNumber,
                    oi.Quantity,
                    oi.PriceAtOrder,
                    Total = oi.Quantity * oi.PriceAtOrder
                })
            });
        }
        
        // Обновить статус заказа — только Admin и Manager
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusModel model)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound(new { message = "Заказ не найден" });
            
            order.Status = model.Status;
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Статус обновлен", status = order.Status });
        }
        
        // Удалить заказ — только Admin и Manager
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
            
            if (order == null)
                return NotFound(new { message = "Заказ не найден" });
            
            // Возвращаем товары на склад
            foreach (var item in order.OrderItems)
            {
                var part = await _context.Parts.FindAsync(item.PartId);
                if (part != null)
                    part.StockQuantity += item.Quantity;
            }
            
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Заказ удален, остатки восстановлены" });
        }
    }
    
    public class CreateOrderModel
    {
        public int CustomerId { get; set; }
        public int UserId { get; set; }
        public List<OrderItemModel> Items { get; set; } = new();
    }
    
    public class OrderItemModel
    {
        public int PartId { get; set; }
        public int Quantity { get; set; }
    }
    
    public class UpdateStatusModel
    {
        public string Status { get; set; } = string.Empty;
    }
}