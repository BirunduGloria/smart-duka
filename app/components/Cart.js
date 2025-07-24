import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:3003"; // Your json-server URL

function Cart({ currency = "KES" }) {
  const [cartItems, setCartItems] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(1); // Default 1 for KES
  const [pastSales, setPastSales] = useState([]);

  // Fetch cart
  useEffect(() => {
    fetch(`${API_BASE}/cart`)
      .then(res => res.json())
      .then(setCartItems)
      .catch(err => console.error("Cart fetch failed:", err));
  }, []);

  // Fetch past purchases
  useEffect(() => {
    fetch(`${API_BASE}/sales`)
      .then(res => res.json())
      .then(setPastSales)
      .catch(err => console.error("Sales fetch failed:", err));
  }, []);

  // Currency switcher
  useEffect(() => {
    if (currency === "USD") {
      // Example exchange rate
      setExchangeRate(0.0075);
    } else {
      setExchangeRate(1);
    }
  }, [currency]);

  const updateQuantity = (id, newQty) => {
    const updatedItem = cartItems.find(item => item.id === id);
    if (!updatedItem) return;

    fetch(`${API_BASE}/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    })
      .then(res => res.json())
      .then(data =>
        setCartItems(items =>
          items.map(item => (item.id === id ? { ...item, quantity: newQty } : item))
        )
      );
  };

  const removeItem = id => {
    fetch(`${API_BASE}/cart/${id}`, { method: "DELETE" })
      .then(() => setCartItems(items => items.filter(item => item.id !== id)));
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * exchangeRate,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return alert("Cart is empty.");

    const sale = {
      items: cartItems,
      total: cartTotal,
      currency,
      date: new Date().toISOString(),
    };

    fetch(`${API_BASE}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
    })
      .then(res => res.json())
      .then(() => {
        setCartItems([]); // Clear cart
        alert("Sale submitted!");
      })
      .catch(err => {
        console.error("Checkout failed:", err);
        alert("Checkout failed.");
      });
  };

  const reorder = sale => {
    const newItems = sale.items.map(({ name, price, quantity }) => ({
      name,
      price,
      quantity,
    }));
    // Add reordered items to cart
    newItems.forEach(item => {
      fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    });
    alert("Items reordered to cart.");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">🛒 Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id} className="border p-2 mb-2 flex justify-between">
              <div>
                <strong>{item.name}</strong>
                <p>
                  Qty:{" "}
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 ml-2"
                  />
                </p>
                <p>
                  Subtotal: {(item.price * item.quantity * exchangeRate).toFixed(2)}{" "}
                  {currency}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <p className="font-semibold">
          Total: {cartTotal.toFixed(2)} {currency}
        </p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700"
        >
          ✅ Checkout
        </button>
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-2">🧾 Past Purchases</h3>
      {pastSales.length === 0 ? (
        <p>No past sales.</p>
      ) : (
        <ul>
          {pastSales.map(sale => (
            <li key={sale.id} className="border p-2 mb-2">
              <p>
                <strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> {sale.total.toFixed(2)} {sale.currency}
              </p>
              <ul className="ml-4">
                {sale.items.map((item, i) => (
                  <li key={i}>
                    {item.name} - {item.quantity} pcs @ {item.price} each
                  </li>
                ))}
              </ul>
              <button
                onClick={() => reorder(sale)}
                className="bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-600"
              >
                🔁 Reorder
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
