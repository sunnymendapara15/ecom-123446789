const Cart = ({ cartItems, onUnselect, busy }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="page-section">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="muted">Your cart is empty. Select some favorites from the Shop.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.productId} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">Unit price ${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button disabled={busy} onClick={() => onUnselect(item.productId)}>
                  Remove one
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <p className="muted">Each "Remove one" action decrements quantity until the item leaves the cart.</p>
        </>
      )}
    </section>
  );
};

export default Cart;
