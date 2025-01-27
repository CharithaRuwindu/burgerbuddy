using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(ContactNumber), IsUnique = true)]
    public class User
    {
        [Key]
        public Guid User_ID { get; set; }

        [MaxLength(50)]
        public required string FirstName { get; set; }
        [MaxLength(50)] 
        public required string LastName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public required string Email { get; set; }
        [MaxLength(255)]
        public required string Hashedpassword { get; set; }

        [MaxLength(10)]
        public required string ContactNumber { get; set; }
        [MaxLength(200)]
        public required string Address { get; set; }

        public required bool IsActive { get; set; }

        public required UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public enum UserRole
    {
        Admin = 1,
        Manager = 2,
        Customer = 3
    }

}
