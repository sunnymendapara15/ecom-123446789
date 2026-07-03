const Shop = ({ products, cartItems, onSelect, busy }) => {
  return (
    <section className="page-section">
      <h2>Shop</h2>
      {products.length === 0 ? (
        <p className="muted">Loading available products…</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const quantity = cartItems.find((item) => item.productId === product.id)?.quantity ?? 0;
            return (
              <article key={product.id} className="product-card">
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <button disabled={busy} onClick={() => onSelect(product.id)}>
                      Add to cart
                    </button>
                  </div>
                  <p className="muted">{quantity > 0 ? `In cart: ${quantity}` : 'Not in cart yet'}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Shop;
