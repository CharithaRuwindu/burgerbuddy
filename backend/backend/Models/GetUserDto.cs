namespace backend.Models
{
    public class GetUserDto
    {
        public required Guid User_ID { get; set; }
        public required string firstName { get; set; }
        public required string lastName { get; set; }
        public required string email { get; set; }
        public required string hashedpassword { get; set; }
        public required string contactNumber { get; set; }
        public required string address { get; set; }
        public required bool isActive { get; set; }
    }
}
