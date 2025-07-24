import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

const API = "http://localhost:3003";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

      setCartItems(cartData);
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

      setCartItems(prev =>
        prev.map(item => (item.id === id ? updatedItem : item))
      );
    } catch (err) {
      console.error(err);
      setError("Could not update quantity");
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const res = await fetch(`${API}/cart/${id}`, {
        method: "DELETE"
      });

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

      // Clear cart
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
          const existing = cartItems.find(i => i.name === item.name);
          if (existing) {
            await fetch(`${API}/cart/${existing.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity: existing.quantity + item.quantity })
            });
          } else {
            const { id, ...newItem } = item;
            await fetch(`${API}/cart`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newItem)
            });
          }
        })
      );

      const updatedCart = await fetch(`${API}/cart`);
      setCartItems(await updatedCart.json());
      alert("Items reordered");
    } catch (err) {
      console.error(err);
      alert("Reorder failed");
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <NavBar />
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cartItems.map(item => (
              <li key={item.id} className="border p-4 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p>KES {item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-16 border px-2 py-1 text-center"
                    />
                    <p>KES {(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => handleRemoveItem(item.id)}>
                    
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 flex justify-between items-center">
            <h3 className="text-lg font-bold">Total</h3>
            <p className="text-xl font-bold">KES {cartTotal.toFixed(2)}</p>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </>
      )}

      <hr className="my-6" />

      <h3 className="text-xl font-bold mb-2">Order History</h3>
      {sales.length === 0 ? (
        <p>No sales yet</p>
      ) : (
        <ul className="space-y-4">
          {sales.map((sale, i) => (
            <li key={i} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p>{new Date(sale.date).toLocaleString()}</p>
                  <p>{sale.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">KES {sale.total.toFixed(2)}</p>
                  <button
                    onClick={() => handleReorder(sale.items)}
                    className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
