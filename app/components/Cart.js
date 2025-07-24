import React, { useState, useEffect } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [sales, setSales] = useState([]);
  const API = "http://localhost:3003";

  useEffect(() => {
    fetch(`${API}/cart`)
      .then(res => res.json())
      .then(setCartItems);

    fetch(`${API}/sales`)
      .then(res => res.json())
      .then(setSales);
  }, []);

  function handleCheckout() {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newSale = {
      items: cartItems,
      date: new Date().toISOString(),
      total
    };

    fetch(`${API}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSale)
    })
      .then(res => res.json())
      .then(savedSale => {
        alert("Checkout complete!");
        setSales([...sales, savedSale]);
        setCartItems([]);

        // Optionally clear the cart from server
        cartItems.forEach(item => {
          fetch(`${API}/cart/${item.id}`, { method: "DELETE" });
        });
      });
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>🛒 Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - {item.quantity} × KES {item.price} ={" "}
              <strong>KES {item.quantity * item.price}</strong>
            </li>
          ))}
        </ul>
      )}

      <h3>Total: KES {cartTotal}</h3>
      <button onClick={handleCheckout}>Checkout</button>

      <hr />
      <h3>Past Purchases</h3>
      {sales.length === 0 ? (
        <p>No past sales yet.</p>
      ) : (
        <ul>
          {sales.map((sale, index) => (
            <li key={index}>
              {new Date(sale.date).toLocaleString()} - KES {sale.total}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
