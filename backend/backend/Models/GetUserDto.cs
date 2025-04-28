using backend.Models.Entities;

namespace backend.Models
{
    public class GetUserDto
    {
        public required Guid User_ID { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        //public required string Hashedpassword { get; set; }
        public required string ContactNumber { get; set; }
        public required string Address { get; set; }
        public required string Role { get; set; }
        public required bool IsActive { get; set; }
    }
}
