
import React from "react";

export default function CartItem({ item, updateQuantity, removeItem }) {
  const handleChange = (e) => {
    const newQty = parseInt(e.target.value);
    if (newQty >= 1) updateQuantity(item.id, newQty);
  };

  return (
    <div className="cart-item">
      <p><strong>{item.name}</strong></p>
      <p>Price: {item.price}</p>
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={handleChange}
      />
      <p>Subtotal: {item.price * item.quantity}</p>
      <button onClick={() => removeItem(item.id)}>Remove</button>
    </div>
  );
}
