'use client';

import { useState, useEffect } from 'react';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [currency, setCurrency] = useState('KES');
  const [salesHistory, setSalesHistory] = useState([]);

  // Load cart items on mount
  useEffect(() => {
    fetch('http://localhost:3001/cart')
      .then(res => res.json())
      .then(setCartItems)
      .catch(err => console.error('Failed to fetch cart:', err));

    fetch('http://localhost:3001/sales')
      .then(res => res.json())
      .then(setSalesHistory)
      .catch(err => console.error('Failed to fetch sales history:', err));
  }, []);

  const handleQuantityChange = (id, newQty) => {
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );

    fetch(`http://localhost:3001/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
  };

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    fetch(`http://localhost:3001/cart/${id}`, { method: 'DELETE' });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert("Cart is empty!");

    const sale = {
      items: cartItems,
      total: total,
      currency: currency,
      date: new Date().toISOString(),
    };

    fetch('http://localhost:3001/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    })
      .then(() => {
        setCartItems([]);
        alert("Checkout complete!");
      })
      .catch(err => alert("Checkout failed."));
  };

  const handleReorder = (sale) => {
    sale.items.forEach(item => {
      fetch('http://localhost:3001/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    });
    alert("Items reordered to cart!");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
          <div className="mt-6 text-xl font-semibold">
            Total: {currency} {total.toFixed(2)}
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Checkout
          </button>
        </>
      )}

      {/* Sales History */}
      <h2 className="text-xl font-bold mt-10 mb-2">🧾 Past Purchases</h2>
      {salesHistory.length === 0 ? (
        <p className="text-gray-500">No past purchases yet.</p>
      ) : (
        salesHistory.map((sale, i) => (
          <div key={i} className="border p-3 mb-4 rounded shadow-sm">
            <div className="font-semibold">
              {new Date(sale.date).toLocaleString()}
            </div>
            <ul className="text-sm mb-2">
              {sale.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} - {item.currency} {item.price}
                </li>
              ))}
            </ul>
            <div className="font-medium mb-2">
              Total: {sale.currency} {sale.total.toFixed(2)}
            </div>
            <button
              onClick={() => handleReorder(sale)}
              className="text-blue-600 hover:underline"
            >
              Reorder
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function CartItem({ item, onQuantityChange, onRemove }) {
  const { id, name, price, quantity, currency } = item;

  return (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <div>
        <h4 className="text-lg font-semibold">{name}</h4>
        <p className="text-sm text-gray-600">
          {currency} {price.toFixed(2)} x {quantity} = {currency} {(price * quantity).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={quantity}
          onChange={e =>
            onQuantityChange(id, parseInt(e.target.value) || 0)
          }
          className="w-16 border rounded px-2 py-1"
          min="1"
        />
        <button
          onClick={() => onRemove(id)}
          className="text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default Cart;
