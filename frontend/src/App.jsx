import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import "./assets/styles.css";

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const buildUrl = (path) => `${apiBase}${path}`;

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    const timer = setTimeout(() => setStatusMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(buildUrl("/api/products"));
      if (!response.ok) {
        throw new Error("Unable to load products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setStatusMessage(error?.message ?? "Failed to load products");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(buildUrl("/api/cart"));
      if (!response.ok) {
        throw new Error("Unable to load cart");
      }

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setStatusMessage(error?.message ?? "Failed to load cart");
    }
  };

  const mutateCart = async (method, endpoint, successLabel) => {
    setBusy(true);
    try {
      const response = await fetch(buildUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "Request failed");
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart);
      setStatusMessage(successLabel);
    } catch (error) {
      setStatusMessage(error?.message ?? "Cart update failed");
    } finally {
      setBusy(false);
    }
  };

  const addProductToCart = (productId) => mutateCart("POST", `/api/cart/${productId}`, "Product added to cart");
  const removeProductFromCart = (productId) => mutateCart("DELETE", `/api/cart/${productId}`, "Product removed from selection");

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>ecom-123446789</h1>
          <p>Two-page storefront powered by React + .NET</p>
        </div>
        <nav>
          <NavLink to="/" end>
            Shop
          </NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
        </nav>
      </header>

      {statusMessage && (
        <div className="status-banner">
          <span>{statusMessage}</span>
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Shop products={products} cartItems={cartItems} onSelect={addProductToCart} busy={busy} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} onUnselect={removeProductFromCart} busy={busy} />} />
          <Route path="*" element={<Shop products={products} cartItems={cartItems} onSelect={addProductToCart} busy={busy} />} />
        </Routes>
      </main>
    </div>
  );
}
