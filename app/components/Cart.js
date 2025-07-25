import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

const API = "";
const CONVERSION_RATE = 160; // 1 USD = 160 KES

function Cart() {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sales');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("KES");
  const [toast, setToast] = useState("");
  const [itemNotes, setItemNotes] = useState({});
  const [lastRemoved, setLastRemoved] = useState(null);

  // Helper for price formatting
  const conversionRate = 160;
  const formatPrice = (price) => {
    const converted = currency === 'USD' ? (price / conversionRate).toFixed(2) : Number(price).toFixed(2);
    return currency === 'USD' ? `$ ${converted}` : `KES ${converted}`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch products from public/products.json
        const productsRes = await fetch('/products.json');
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const productsData = await productsRes.json();
        const products = Array.isArray(productsData[0]) ? productsData[0] : productsData;
        setProducts(products);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Persist cart and sales to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sales', JSON.stringify(sales));
    }
  }, [sales]);

  // Update quantity of an item in cart
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const handleRemoveItem = (id) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (!window.confirm("Are you sure you want to remove this item from the cart?")) return;
    setCartItems(prev => prev.filter(item => item.id !== id));
    setLastRemoved(itemToRemove);
    setToast('Item removed.');
    setTimeout(() => {
      setToast("");
      setLastRemoved(null);
    }, 4000);
  };

  // Undo remove
  const handleUndoRemove = () => {
    if (!lastRemoved) return;
    setCartItems(prev => [...prev, lastRemoved]);
    setToast('Item restored!');
    setTimeout(() => setToast(""), 2000);
    setLastRemoved(null);
  };

  // Checkout: Save to /sales and clear cart
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setToast("Your cart is empty. Add some items before checkout.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newSale = {
      items: cartItems,
      date: new Date().toISOString(),
      total
    };
    setSales(prev => [...prev, newSale]);
    setCartItems([]);
    setToast("Checkout successful! Thank you for your purchase.");
    setTimeout(() => setToast(""), 3000);
  };

  const handleReorder = (items) => {
    items.forEach(item => {
      const existing = cartItems.find(i => i.id === item.id);
      if (existing) {
        setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      } else {
        setCartItems(prev => [...prev, { ...item }]);
      }
    });
    setToast("Items have been added to your cart!");
    setTimeout(() => setToast(""), 3000);
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    const price = product ? (product.pricing?.price ?? product.price ?? 0) : 0;
    return sum + price * (item.quantity || 1);
  }, 0);
  const PLACEHOLDER_IMG = 'https://via.placeholder.com/120x120?text=No+Image';

  if (isLoading) {
    return (
      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <NavBar />
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ width: 32, height: 32, border: '4px solid #ccc', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        <NavBar />
        <div style={{ color: 'red', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          Error: {error}
          <button 
            onClick={() => window.location.reload()}
            style={{ marginLeft: '16px', backgroundColor: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '32px auto', background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <NavBar />
      <h2 style={{ fontSize: '2.2rem', fontWeight: 700, margin: '24px 0 32px 0', letterSpacing: '-1px', color: '#222' }}>🛒 Your Shopping Cart</h2>
      <div style={{ marginBottom: 24, textAlign: 'right' }}>
        <label style={{ marginRight: 8 }}>Currency:</label>
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: 4, borderRadius: 4 }}>
          <option value="KES">KES</option>
          <option value="USD">USD</option>
        </select>
      </div>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: 8 }}>Your cart is empty</p>
          <p style={{ color: '#b0b0b0' }}>Add some items to get started</p>
        </div>
      ) : (
        <>
          <ul style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            padding: '2rem',
            margin: 0,
            background: 'transparent',
            listStyle: 'none',
          }}>
            {cartItems.map(item => {
              const product = products.find(p => p.id === item.id);
              if (!product) return null;
              const price = product.pricing?.price ?? product.price ?? 0;
              return (
                <li key={item.id} style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 0,
                  maxWidth: 340,
                  margin: '0 auto',
                  position: 'relative',
                }}>
                  <img
                    src={product.image || PLACEHOLDER_IMG}
                    alt={product.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginBottom: 16,
                      background: '#f5f5f5',
                      border: '1px solid #eee',
                    }}
                  />
                  <h4 style={{ fontWeight: 700, fontSize: 20, margin: '0 0 8px 0', textAlign: 'center' }}>{product.name}</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: 14, color: '#666' }}>Category: <span style={{ color: '#444' }}>{product.category}</span></p>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>{formatPrice(price)} each</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      style={{ width: 32, height: 32, fontSize: 20, border: '1px solid #ccc', borderRadius: 6, backgroundColor: '#f3f3f3', cursor: 'pointer', color: '#333' }}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      style={{ width: 54, border: '1px solid #ccc', padding: '6px', textAlign: 'center', borderRadius: 6, fontSize: 16 }}
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      style={{ width: 32, height: 32, fontSize: 20, border: '1px solid #ccc', borderRadius: 6, backgroundColor: '#f3f3f3', cursor: 'pointer', color: '#333' }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '110px' }}>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: 16, color: '#222' }}>
                      {formatPrice(price * (item.quantity || 1))}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{ color: '#ef4444', cursor: 'pointer', fontSize: 22, background: 'none', border: 'none', padding: '4px', marginLeft: 8 }}
                    title="Remove item"
                  >
                    ×
                  </button>
                  <div style={{ flexBasis: '100%', marginTop: 10 }}>
                    <label htmlFor={`note-${item.id}`} style={{ fontSize: 13, color: '#555', fontWeight: 500, display: 'block', marginBottom: 2 }}>Note for this item:</label>
                    <input
                      id={`note-${item.id}`}
                      type="text"
                      value={itemNotes[item.id] || ''}
                      onChange={e => setItemNotes(notes => ({ ...notes, [item.id]: e.target.value }))}
                      placeholder="Add a note or special instruction..."
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: '7px 10px', fontSize: 14, color: '#333', background: '#f9fafb', marginBottom: 0 }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#222' }}>Total</h3>
            <p style={{ fontSize: '1.7rem', fontWeight: 700, margin: 0, color: '#16a34a' }}>{formatPrice(cartTotal)}</p>
          </div>
          <button
            onClick={handleCheckout}
            style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '16px 0', borderRadius: '10px', fontWeight: 600, fontSize: 18, border: 'none', cursor: 'pointer', marginBottom: 24, boxShadow: '0 2px 8px rgba(22,163,74,0.08)' }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
      <hr style={{ margin: '40px 0', border: 'none', borderTop: '2px solid #e5e7eb' }} />
      <section>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', color: '#222' }}>Your Order History</h3>
        {sales.length === 0 ? (
          <p style={{ color: '#6b7280', padding: '24px 0', fontSize: 16 }}>No past purchases yet.</p>
        ) : (
          <ul style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            padding: '2rem',
            margin: 0,
            background: 'transparent',
            listStyle: 'none',
          }}>
            {sales.map((sale, index) => (
              <li key={index} style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 0,
                maxWidth: 340,
                margin: '0 auto',
                position: 'relative',
              }}>
                <div style={{ marginBottom: '14px', width: '100%' }}>
                  <div style={{ minWidth: 180, marginBottom: 8 }}>
                    <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{new Date(sale.date).toLocaleString()}</p>
                    <p style={{ fontWeight: 600, margin: 0, color: '#444', fontSize: 15 }}>{sale.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: 8 }}>
                    <p style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#2563eb', letterSpacing: '-1px' }}>{formatPrice(sale.total)}</p>
                    <button
                      onClick={() => handleReorder(sale.items)}
                      style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15, boxShadow: '0 1px 4px rgba(37,99,235,0.08)' }}
                    >
                      Reorder
                    </button>
                  </div>
                </div>
                {/* Images row */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  {sale.items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId || p.id === item.id) || {};
                    return (
                      <img
                        key={idx}
                        src={product.image || PLACEHOLDER_IMG}
                        alt={item.name || 'Product'}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#f5f5f5' }}
                      />
                    );
                  })}
                </div>
                <ul style={{ fontSize: 15, color: '#444', margin: 0, padding: 0, borderTop: '1px solid #f0f0f0', paddingTop: 12, width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {sale.items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId || p.id === item.id) || {};
                    return (
                      <li key={idx} style={{ marginBottom: 10, padding: '8px 0', borderBottom: idx < sale.items.length - 1 ? '1px solid #f3f3f3' : 'none', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start', background: 'none' }}>
                        <img src={product.image || PLACEHOLDER_IMG} alt={item.name || 'Product'} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#f5f5f5', marginRight: 8 }} />
                        <div style={{ flex: 1, minWidth: 80, textAlign: 'left' }}>
                          <div style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>{item.name || 'Unknown'}</div>
                          <div style={{ color: '#888', fontSize: 13 }}>Category: {product.category || item.category || 'N/A'}</div>
                          <div style={{ color: '#555', fontSize: 14 }}>Qty: <span style={{ fontWeight: 600 }}>{item.quantity}</span></div>
                        </div>
                        <div style={{ minWidth: 70, textAlign: 'right', fontWeight: 700, color: '#16a34a', fontSize: 16, alignSelf: 'center' }}>{formatPrice(item.price * item.quantity)}</div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Toast Message */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, backgroundColor: '#333', color: 'white', padding: '14px 28px', borderRadius: '10px', zIndex: 1000, fontSize: 17, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>{toast}</span>
          {lastRemoved && (
            <button
              onClick={handleUndoRemove}
              style={{ background: '#fff', color: '#2563eb', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginLeft: 12 }}
            >
              Undo
            </button>
          )}
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Cart;
