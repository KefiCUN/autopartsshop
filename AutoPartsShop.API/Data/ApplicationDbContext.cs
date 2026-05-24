using Microsoft.EntityFrameworkCore;
using AutoPartsShop.API.Models;

namespace AutoPartsShop.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Part> Parts { get; set; } = null!;
        public DbSet<PartAnalogue> PartAnalogues { get; set; } = null!;
        public DbSet<PartCompatibility> PartCompatibilities { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<CustomerInteraction> CustomerInteractions { get; set; } = null!;
        public DbSet<Reminder> Reminders { get; set; } = null!;
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Указываем правильные имена таблиц
            modelBuilder.Entity<PartCompatibility>().ToTable("partcompatibility");
            modelBuilder.Entity<PartAnalogue>().ToTable("partanalogues");
            modelBuilder.Entity<Customer>().ToTable("customers");
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<OrderItem>().ToTable("orderitems");
            modelBuilder.Entity<CustomerInteraction>().ToTable("customerinteractions");
            modelBuilder.Entity<Reminder>().ToTable("reminders");
            
            // Настройка внешних ключей
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.Creator)
                .WithMany()
                .HasForeignKey(c => c.CreatedBy)
                .IsRequired(false);
            
            // PartAnalogues
            modelBuilder.Entity<PartAnalogue>(entity =>
            {
                entity.HasOne(pa => pa.Part)
                    .WithMany(p => p.Analogues)
                    .HasForeignKey(pa => pa.PartId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(pa => pa.AnaloguePart)
                    .WithMany()
                    .HasForeignKey(pa => pa.AnaloguePartId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}