import React, { useState, useEffect, useCallback } from "react";
import NavBar from '../components/NavBar';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = "http://localhost:3003";

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [cartResponse, salesResponse] = await Promise.all([
        fetch(`${API}/cart`),
        fetch(`${API}/sales`)
      ]);
      
      if (!cartResponse.ok || !salesResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [cartData, salesData] = await Promise.all([
        cartResponse.json(),
        salesResponse.json()
      ]);
      
      setCartItems(cartData);
      setSales(salesData);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update quantity of an item in cart
  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await fetch(`${API}/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (!response.ok) throw new Error('Failed to update quantity');
      
      const updated = await response.json();
      setCartItems(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (id) => {
    try {
      const response = await fetch(`${API}/cart/${id}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  // Checkout: Save to /sales and clear cart
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add some items before checkout.");
      return;
    }

    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newSale = {
        items: cartItems,
        date: new Date().toISOString(),
        total
      };

      const response = await fetch(`${API}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale)
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      const savedSale = await response.json();
      
      // Clear cart on server in parallel
      await Promise.all(
        cartItems.map(item => 
          fetch(`${API}/cart/${item.id}`, { method: "DELETE" })
        )
      );
      
      alert("Checkout successful! Thank you for your purchase.");
      setSales(prev => [...prev, savedSale]);
      setCartItems([]);
    } catch (err) {
      setError(err.message);
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  // Reorder: Add sale items back to cart
  const handleReorder = async (items) => {
    try {
      await Promise.all(
        items.map(async item => {
          const existing = cartItems.find(i => i.id === item.id);
          if (existing) {
            // Update quantity if already in cart
            const updatedQuantity = existing.quantity + item.quantity;
            await fetch(`${API}/cart/${item.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity: updatedQuantity })
            });
          } else {
            // Add new item to cart
            const { id, ...newItem } = item; // remove id to let server assign new one
            await fetch(`${API}/cart`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newItem)
            });
          }
        })
      );
      
      // Refresh cart
      const response = await fetch(`${API}/cart`);
      if (!response.ok) throw new Error('Failed to refresh cart');
      setCartItems(await response.json());
      
      alert("Items have been added to your cart!");
    } catch (err) {
      setError(err.message);
      console.error("Reorder error:", err);
      alert("Failed to reorder items. Please try again.");
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <NavBar />
        <div className="text-center py-8">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <NavBar />
        <div className="text-red-500 p-4 bg-red-50 rounded">
          Error: {error}
          <button 
            onClick={fetchData}
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <NavBar />
      <h2 className="text-2xl font-bold mb-4">🛒 Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
          <p className="text-gray-400">Add some items to get started</p>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {cartItems.map(item => (
              <li
                key={item.id}
                className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-gray-600">
                    KES {item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-medium">
                      KES {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Total</h3>
              <p className="text-2xl font-bold">KES {cartTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      <hr className="my-8 border-gray-200" />
      
      <section>
        <h3 className="text-xl font-bold mb-4">Your Order History</h3>
        {sales.length === 0 ? (
          <p className="text-gray-500 py-4">No past purchases yet.</p>
        ) : (
          <ul className="space-y-4">
            {sales.map((sale, index) => (
              <li key={index} className="border p-4 rounded-lg hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(sale.date).toLocaleString()}
                    </p>
                    <p className="font-medium">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold">KES {sale.total.toFixed(2)}</p>
                    <button
                      onClick={() => handleReorder(sale.items)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Cart;