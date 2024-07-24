using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using webapi.Models;

namespace webapi
{
    public class FinanceDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }

        public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany<Account>()
                .WithOne()
                .HasForeignKey(a => a.UserID);
            modelBuilder.Entity<Account>()
               .HasOne<User>()
               .WithMany()
               .HasForeignKey(u => u.UserID);
            base.OnModelCreating(modelBuilder);
        }

    }
}
