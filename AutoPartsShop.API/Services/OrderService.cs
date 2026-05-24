using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Models;

namespace AutoPartsShop.API.Services
{
    public class OrderService
    {
        private readonly ApplicationDbContext _context;
        
        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<(bool Success, string Message, Order? Order)> CreateOrderAsync(
            int customerId, 
            int userId, 
            List<(int PartId, int Quantity)> items)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Проверяем остатки
                foreach (var item in items)
                {
                    var part = await _context.Parts.FindAsync(item.PartId);
                    if (part == null)
                        return (false, $"Запчасть с ID {item.PartId} не найдена", null);
                    
                    if (part.StockQuantity < item.Quantity)
                        return (false, $"Запчасти '{part.Name}' осталось только {part.StockQuantity}, а вы заказали {item.Quantity}", null);
                }
                
                // Создаем заказ
                var orderNumber = $"ORD-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6)}";
                
                var order = new Order
                {
                    OrderNumber = orderNumber,
                    CustomerId = customerId,
                    UserId = userId,
                    Status = "New",
                    OrderDate = DateTime.Now
                };
                
                decimal totalAmount = 0;
                foreach (var item in items)
                {
                    var part = await _context.Parts.FindAsync(item.PartId);
                    
                    var orderItem = new OrderItem
                    {
                        PartId = item.PartId,
                        Quantity = item.Quantity,
                        PriceAtOrder = part!.RetailPrice
                    };
                    
                    order.OrderItems.Add(orderItem);
                    totalAmount += orderItem.Quantity * orderItem.PriceAtOrder;
                    
                    // Уменьшаем остаток
                    part.StockQuantity -= item.Quantity;
                }
                
                order.TotalAmount = totalAmount;
                
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                
                // Логируем взаимодействие
                var interaction = new CustomerInteraction
                {
                    CustomerId = customerId,
                    UserId = userId,
                    Type = "Order",
                    Topic = "Оформление заказа",
                    Result = $"Создан заказ {orderNumber}",
                    InteractionDate = DateTime.Now
                };
                _context.CustomerInteractions.Add(interaction);
                await _context.SaveChangesAsync();
                
                await transaction.CommitAsync();
                
                return (true, "Заказ успешно создан", order);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Ошибка при создании заказа: {ex.Message}", null);
            }
        }
        
        public async Task<List<Order>> GetCustomerOrdersAsync(int customerId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Part)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
    }
}