using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

namespace backend.Models.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(ContactNumber), IsUnique = true)]
    public class User
    {
        [Key]
        public Guid User_ID { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public required string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [MaxLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public required string LastName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        [CustomEmailValidation(ErrorMessage = "Invalid email domain or format")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MaxLength(255, ErrorMessage = "Hashed password cannot exceed 255 characters")]
        public required string Hashedpassword { get; set; }

        [Required(ErrorMessage = "Contact number is required")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact number must be 10 digits")]
        [MaxLength(10, ErrorMessage = "Contact number cannot exceed 10 characters")]
        public required string ContactNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [MaxLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
        public required string Address { get; set; }

        [Required]
        public required bool IsActive { get; set; }

        [Required]
        public required UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        [NotMapped]
        public string? PlainTextPassword { get; set; }
    }

    public enum UserRole
    {
        Admin = 1,
        Manager = 2,
        Customer = 3
    }

    public class CustomEmailValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
                return new ValidationResult("Email is required");

            string email = value.ToString()!;

            var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            if (!regex.IsMatch(email))
                return new ValidationResult("Invalid email format");

            string[] blockedDomains = { "example.com", "test.com", "temporary.org" };
            string domain = email.Split('@')[1].ToLower();

            if (blockedDomains.Contains(domain))
                return new ValidationResult($"Emails from {domain} are not allowed");


            return ValidationResult.Success;
        }
    }
}