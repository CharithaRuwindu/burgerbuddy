namespace backend.Models
{
    public class AddItemDto
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
        public double Price { get; set; }
        public required byte[] ItemImage { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsActive { get; set; }
    }
}
