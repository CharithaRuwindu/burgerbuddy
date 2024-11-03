using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models.Entities
{
    [Index(nameof(email), IsUnique = true)]
    [Index(nameof(contactNumber), IsUnique = true)]
    public class User
    {
        [Key]
        public Guid User_ID { get; set; }

        [MaxLength(50)]
        public required string firstName { get; set; }
        [MaxLength(50)] 
        public required string lastName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public required string email { get; set; }
        [MaxLength(255)]
        public required string hashedpassword { get; set; }

        [MaxLength(10)]
        public required string contactNumber { get; set; }
        [MaxLength(200)]
        public required string address { get; set; }

        public required bool isActive { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
