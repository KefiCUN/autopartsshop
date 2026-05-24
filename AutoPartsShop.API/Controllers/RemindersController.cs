using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Data;
using AutoPartsShop.API.Models;

namespace AutoPartsShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RemindersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public RemindersController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateReminderModel model)
        {
            var reminder = new Reminder
            {
                UserId = model.UserId,
                CustomerId = model.CustomerId,
                ReminderText = model.ReminderText,
                ReminderDate = model.ReminderDate,
                IsCompleted = false,
                CreatedAt = DateTime.Now
            };
            
            _context.Reminders.Add(reminder);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Напоминание создано", reminder });
        }
        
        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            var reminders = await _context.Reminders
                .Include(r => r.Customer)
                .Where(r => !r.IsCompleted && r.ReminderDate <= DateTime.Now.AddDays(1))
                .OrderBy(r => r.ReminderDate)
                .Select(r => new
                {
                    r.Id,
                    r.ReminderText,
                    r.ReminderDate,
                    CustomerName = r.Customer != null ? r.Customer.FullName : "",
                    CustomerPhone = r.Customer != null ? r.Customer.Phone : ""
                })
                .ToListAsync();
            
            return Ok(reminders);
        }
        
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            var reminder = await _context.Reminders.FindAsync(id);
            if (reminder == null)
                return NotFound();
            
            reminder.IsCompleted = true;
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Напоминание выполнено" });
        }
    }
    
    public class CreateReminderModel
    {
        public int UserId { get; set; }
        public int? CustomerId { get; set; }
        public string ReminderText { get; set; } = string.Empty;
        public DateTime ReminderDate { get; set; }
    }
}