namespace backend.Models
{
    public class UpdateUserDto
    {
        public required string firstName { get; set; }
        public required string lastName { get; set; }
        public required string email { get; set; }
        public required string hashedpassword { get; set; }
        public required double contactNumber { get; set; }
        public required int roleId { get; set; }
        public required string address { get; set; }
    }
}
