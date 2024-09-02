namespace backend.Models
{
    public class Menu
    {
        public int Menu_ID { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public double Price { get; set; }
        public bool IsActive { get; set; }
    }
}
