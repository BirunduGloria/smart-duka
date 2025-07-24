'use client';

import { useState, useEffect } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from your API
  useEffect(() => {
    fetch('http://localhost:3001/cart')
      .then((res) => res.json())
      .then(setCartItems)
      .catch((err) => console.error('Failed to fetch cart:', err));
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    // Optional: update on server with PATCH
    fetch(`http://localhost:3001/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    fetch(`http://localhost:3001/cart/${id}`, { method: 'DELETE' });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        ))
      )}
      <div className="mt-6 text-xl font-semibold">
        Total: KES {total.toFixed(2)}
      </div>
    </div>
  );
}

// ✅ Define CartItem inside Cart.js
function CartItem({ item, onQuantityChange, onRemove }) {
  const { id, name, price, quantity, currency } = item;

  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onQuantityChange(id, newQuantity);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <div>
        <h4 className="text-lg font-semibold">{name}</h4>
        <p className="text-sm text-gray-600">
          {currency} {price.toFixed(2)} x {quantity}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={quantity}
          onChange={handleChange}
          className="w-16 border rounded px-2 py-1"
          min="0"
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
