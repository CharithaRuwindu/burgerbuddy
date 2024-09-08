namespace backend.Models
{
    public class UpdateItemsDto
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
        public double Price { get; set; }
        public bool IsActive { get; set; }
    }
}
