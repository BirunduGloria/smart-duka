import React, { useState, useEffect } from "react";
import productsDataRaw from "../data/products.json";
import NavBar from "../components/NavBar";

const API = "http://localhost:3003";
const CONVERSION_RATE = 160; // 1 USD = 160 KES

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  // Flatten productsDataRaw in case it's nested
  const products = Array.isArray(productsDataRaw[0]) ? productsDataRaw[0] : productsDataRaw;
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("KES");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cartRes, salesRes] = await Promise.all([
        fetch(`${API}/cart`),
        fetch(`${API}/sales`)
      ]);

      if (!cartRes.ok || !salesRes.ok) throw new Error("Failed to fetch");

      const cartData = await cartRes.json();
      const salesData = await salesRes.json();

      // Enrich cart items with product info from local products.json
      const mergedCart = cartData.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId || p.id === cartItem.id);
        // Always use a number for price, fallback to 0
        const price = product?.pricing?.price ?? product?.price ?? cartItem.price ?? 0;
        return {
          ...cartItem,
          name: product?.name || cartItem.name || "Unknown",
          price: Number(price)
        };
      });

      setCartItems(mergedCart);
      setSales(salesData);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (id, value) => {
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 1) return;

    try {
      const res = await fetch(`${API}/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!res.ok) throw new Error("Failed to update quantity");

      const updatedItem = await res.json();

      const product = products.find(p => p.id === updatedItem.productId);
      setCartItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...updatedItem, name: product?.name, price: product?.price }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not update quantity");
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const res = await fetch(`${API}/cart/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      setError("Could not remove item");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const sale = {
      items: cartItems,
      date: new Date().toISOString(),
      total
    };

    try {
      const res = await fetch(`${API}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sale)
      });

      if (!res.ok) throw new Error("Checkout failed");

      await Promise.all(
        cartItems.map(item =>
          fetch(`${API}/cart/${item.id}`, { method: "DELETE" })
        )
      );

      alert("Checkout complete");
      setCartItems([]);
      setSales(prev => [...prev, sale]);
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  const handleReorder = async (items) => {
    try {
      await Promise.all(
        items.map(async item => {
          const existing = cartItems.find(i => i.productId === item.productId);
          if (existing) {
            await fetch(`${API}/cart/${existing.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity: existing.quantity + item.quantity })
            });
          } else {
            const { id, name, price, ...cartOnlyItem } = item;
            await fetch(`${API}/cart`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(cartOnlyItem)
            });
          }
        })
      );

      loadData();
      alert("Items reordered");
    } catch (err) {
      console.error(err);
      alert("Reorder failed");
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Currency conversion helper
  const convert = (priceKES) =>
    currency === "KES"
      ? Number(priceKES).toFixed(2)
      : (Number(priceKES) / CONVERSION_RATE).toFixed(2);
  const currencySymbol = currency === "KES" ? "KES" : "USD";

  // Debug: log currency state
  console.log("Currency:", currency);

  return (
    <div style={{ padding: '16px', maxWidth: '700px', margin: '0 auto' }}>
      <NavBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>🛒 Your Cart</h2>
        <div>
          <label style={{ marginRight: 8, fontWeight: '500' }}>Currency:</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{ border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px' }}
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
          <div style={{ width: 32, height: 32, border: '4px solid #ccc', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 8 }}></div>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
          <span style={{ fontSize: 32, marginBottom: 8 }}>❌</span>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
          <span style={{ fontSize: 48, marginBottom: 8 }}>🛒</span>
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
            {cartItems.map(item => {
              const product = products.find(p => p.id === item.productId || p.id === item.id);
              return (
                <li key={item.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Product Image */}
                    {product?.image && (
                      <img src={product.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', marginRight: 12 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: '500', margin: 0 }}>{item.name}</h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: 13, color: '#555' }}>Category: {product?.category || 'N/A'}</p>
                      <p style={{ margin: 0 }}>{currencySymbol} {convert(item.price)} each</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        style={{ width: 28, height: 28, fontSize: 18, border: '1px solid #ccc', borderRadius: 4, background: '#f3f3f3', cursor: 'pointer', marginRight: 4 }}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, e.target.value)}
                        style={{ width: 48, border: '1px solid #ccc', padding: '4px', textAlign: 'center', marginRight: 4 }}
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        style={{ width: 28, height: 28, fontSize: 18, border: '1px solid #ccc', borderRadius: 4, background: '#f3f3f3', cursor: 'pointer', marginRight: 8 }}
                      >
                        +
                      </button>
                      <p style={{ margin: 0 }}>{currencySymbol} {convert(item.price * item.quantity)}</p>
                      <button onClick={() => handleRemoveItem(item.id)} style={{ marginLeft: 8, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>❌</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Total</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{currencySymbol} {convert(cartTotal)}</p>
          </div>

          <button
            onClick={handleCheckout}
            style={{ width: '100%', marginTop: 16, background: '#16a34a', color: 'white', padding: '12px 0', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
          >
            Proceed to Checkout
          </button>
        </>
      )}

      <hr style={{ margin: '32px 0' }} />

      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: 8 }}>Order History</h3>
      {sales.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
          <span style={{ fontSize: 32, marginBottom: 8 }}>📦</span>
          <p>No sales yet</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sales.map((sale, i) => (
            <li key={i} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{new Date(sale.date).toLocaleString()}</p>
                  <p style={{ fontSize: 13, margin: 0 }}>{sale.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{currencySymbol} {convert(sale.total)}</p>
                  <button
                    onClick={() => handleReorder(sale.items)}
                    style={{ marginTop: 4, background: '#2563eb', color: 'white', padding: '4px 12px', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                  >
                    Reorder
                  </button>
                </div>
              </div>
              <ul style={{ fontSize: 13, color: '#444', marginLeft: 12, paddingLeft: 0 }}>
                {sale.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 2 }}>
                    {item.name} x {item.quantity} — {currencySymbol} {convert(item.price * item.quantity)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Cart;
