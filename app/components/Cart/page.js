'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:3005';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/cart`).then((res) => setCart(res.data));
    axios.get(`${API_BASE}/sales`).then((res) => setSales(res.data));
  }, []);

  const handleQuantityChange = (id, newQty) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const updated = { ...item, quantity: newQty };

    axios.patch(`${API_BASE}/cart/${id}`, updated).then(() => {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? updated : i))
      );
    });
  };

  const handleRemove = (id) => {
    axios.delete(`${API_BASE}/cart/${id}`).then(() => {
      setCart((prev) => prev.filter((i) => i.id !== id));
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    const sale = {
      date: new Date().toISOString(),
      items: cart,
      total: getTotal(),
      currency,
    };
    axios.post(`${API_BASE}/sales`, sale).then(() => {
      Promise.all(cart.map((item) =>
        axios.delete(`${API_BASE}/cart/${item.id}`)
      )).then(() => setCart([]));
    });
  };

  const handleReorder = (items) => {
    items.forEach((item) => {
      axios.post(`${API_BASE}/cart`, { ...item });
    });
    setTimeout(() => {
      axios.get(`${API_BASE}/cart`).then((res) => setCart(res.data));
    }, 300);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="border-b py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p>
                  {item.currency} {item.price.toFixed(2)} x {item.quantity} ={" "}
                  <strong>{item.currency} {(item.price * item.quantity).toFixed(2)}</strong>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="w-16 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              Total: {currency} {getTotal()}
            </p>
            <button
              onClick={handleCheckout}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      <hr className="my-6" />
      <h3 className="text-lg font-bold mb-2">🧾 Past Purchases</h3>
      {sales.length === 0 ? (
        <p className="text-gray-500">No past purchases yet.</p>
      ) : (
        sales.map((sale) => (
          <div key={sale.id} className="border rounded p-4 mb-3">
            <p className="text-sm text-gray-500">Date: {new Date(sale.date).toLocaleString()}</p>
            <ul className="list-disc ml-5">
              {sale.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} — {item.currency} {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="mt-1 font-medium">
              Total: {sale.currency} {sale.total}
            </p>
            <button
              onClick={() => handleReorder(sale.items)}
              className="mt-2 text-blue-600 hover:underline"
            >
              Reorder
            </button>
          </div>
        ))
      )}
    </div>
  );
}
