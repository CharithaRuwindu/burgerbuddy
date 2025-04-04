using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities
{
    public class UserRefreshToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Token { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public bool IsRevoked { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}