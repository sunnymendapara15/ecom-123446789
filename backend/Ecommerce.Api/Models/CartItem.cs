namespace Ecommerce.Api.Models;

public sealed class CartItem
{
    public int ProductId { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int Quantity { get; set; }
}
