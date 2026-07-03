using Ecommerce.Api.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowReact");

var products = new List<Product>
{
    new(1, "Summit Trail Sneaker", 119.99m, "Lightweight shoes built for all-day comfort and passport-ready style.", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"),
    new(2, "Aurora Wireless Earbuds", 99.50m, "Noise-aware earbuds that keep every call crystal clear.", "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"),
    new(3, "Horizon Travel Pack", 149.00m, "Weather-resistant pack built for laptops, gym gear, and weekend flights.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"),
    new(4, "Lumen Studio Lamp", 42.75m, "Adjustable desk lamp that mimics natural daylight for focused creative work.", "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"),
    new(5, "Equinox Smart Bottle", 34.20m, "Insulated bottle that tracks hydration progress throughout the day.", "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80")
};

var cart = new ConcurrentDictionary<int, CartItem>();

app.MapGet("/", () => Results.Ok(new { message = "Welcome to the ecommerce API" }));
app.MapGet("/api/products", () => Results.Ok(products));
app.MapGet("/api/cart", () => Results.Ok(cart.Values.OrderBy(ci => ci.ProductId)));

app.MapPost("/api/cart/{productId:int}", (int productId) =>
{
    var product = products.FirstOrDefault(p => p.Id == productId);
    if (product is null)
    {
        return Results.NotFound(new { message = "Product not found" });
    }

    cart.AddOrUpdate(productId, _ => new CartItem
    {
        ProductId = product.Id,
        Name = product.Name,
        Price = product.Price,
        Quantity = 1
    }, (_, existing) =>
    {
        existing.Quantity++;
        return existing;
    });

    return Results.Ok(cart.Values.OrderBy(ci => ci.ProductId));
});

app.MapDelete("/api/cart/{productId:int}", (int productId) =>
{
    if (!cart.TryGetValue(productId, out var existing))
    {
        return Results.NotFound(new { message = "Product not currently selected" });
    }

    if (existing.Quantity > 1)
    {
        existing.Quantity--;
    }
    else
    {
        cart.TryRemove(productId, out _);
    }

    return Results.Ok(cart.Values.OrderBy(ci => ci.ProductId));
});

app.Run();
