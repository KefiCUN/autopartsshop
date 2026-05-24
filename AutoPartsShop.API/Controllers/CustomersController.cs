using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace AutoPartsShop.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // Поиск клиентов
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest(new { message = "Введите поисковый запрос" });
            
            term = term.ToLower();
            
            var customers = await _context.Customers
                .Where(c => 
                    c.FullName.ToLower().Contains(term) ||
                    c.Phone.Contains(term) ||
                    (c.Email != null && c.Email.ToLower().Contains(term)) ||
                    (c.CarModel != null && c.CarModel.ToLower().Contains(term))
                )
                .Take(20)
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Phone,
                    c.Email,
                    c.CarModel,
                    c.CarYear
                })
                .ToListAsync();
            
            return Ok(customers);
        }
        
        // Получить всех клиентов
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers
                .OrderBy(c => c.FullName)
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Phone,
                    c.Email,
                    c.CarModel,
                    c.CarYear
                })
                .ToListAsync();
            
            return Ok(customers);
        }
        
        // Создать клиента
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerModel model)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) || string.IsNullOrWhiteSpace(model.Phone))
                return BadRequest(new { message = "Имя и телефон обязательны" });
            
            var customer = new Customer
            {
                FullName = model.FullName,
                Phone = model.Phone,
                Email = model.Email,
                CarModel = model.CarModel,
                CarYear = model.CarYear,
                VIN = model.VIN
            };
            
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            
            return Ok(new
            {
                customer.Id,
                customer.FullName,
                customer.Phone,
                customer.Email,
                customer.CarModel,
                customer.CarYear
            });
        }

        // ===== НОВЫЕ МЕТОДЫ ДЛЯ ИСТОРИИ ВЗАИМОДЕЙСТВИЙ =====
        
        // Получить историю взаимодействий клиента
        [HttpGet("{id}/interactions")]
        public async Task<IActionResult> GetInteractions(int id)
        {
            var interactions = await _context.CustomerInteractions
                .Include(i => i.User)
                .Where(i => i.CustomerId == id)
                .OrderByDescending(i => i.InteractionDate)
                .Take(20)
                .Select(i => new
                {
                    i.Id,
                    i.Type,
                    i.Topic,
                    i.Result,
                    i.Notes,
                    i.InteractionDate,
                    UserName = i.User.FullName
                })
                .ToListAsync();
            
            return Ok(interactions);
        }
        
        // Добавить взаимодействие
        [HttpPost("{id}/interactions")]
        public async Task<IActionResult> AddInteraction(int id, [FromBody] AddInteractionModel model)
        {
            var interaction = new CustomerInteraction
            {
                CustomerId = id,
                UserId = model.UserId,
                Type = model.Type,
                Topic = model.Topic,
                Result = model.Result,
                Notes = model.Notes,
                InteractionDate = DateTime.Now,
                FollowUpDate = model.FollowUpDate
            };
            
            _context.CustomerInteractions.Add(interaction);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Взаимодействие добавлено" });
        }
    }
    
    public class CreateCustomerModel
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? CarModel { get; set; }
        public int? CarYear { get; set; }
        public string? VIN { get; set; }
    }
    
    public class AddInteractionModel
    {
        public int UserId { get; set; }
        public string Type { get; set; } = "Call";
        public string? Topic { get; set; }
        public string? Result { get; set; }
        public string? Notes { get; set; }
        public DateTime? FollowUpDate { get; set; }
    }
}