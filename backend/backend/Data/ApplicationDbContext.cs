using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Menu> Menus { get; set; }
        //public DbSet<User> Users { get; set; }

        //public DbSet<Role> Roles { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
      //      modelBuilder.Entity<Role>()
       //         .HasData(
      //              new Role { RoleId = 1, RoleName = "Admin" },
      //              new Role { RoleId = 2, RoleName = "Kitchen Staff" },
      //              new Role { RoleId = 3, RoleName = "Delivery Staff" }
      //          );

       //     modelBuilder.Entity<User>()
       //         .HasOne(u => u.Roles)
       //         .WithMany(r => r.Users)
       //         .HasForeignKey(u => u.RoleId)
        //        .OnDelete(DeleteBehavior.Restrict);
        //}
    }
}
