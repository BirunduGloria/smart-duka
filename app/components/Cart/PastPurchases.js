import React, { useEffect, useState } from "react";

export default function PastPurchases({ onReorder }) {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/sales")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("Failed to fetch past purchases:", err));
  }, []);

  const handleReorder = (items) => {
    onReorder(items);
    localStorage.setItem("cart", JSON.stringify(items));
    alert("Items added to cart!");
  };

  return (
    <div className="past-purchases">
      <h3>Past Purchases</h3>
      {sales.length === 0 ? (
        <p>No past sales.</p>
      ) : (
        sales.map((sale, index) => (
          <div key={index} className="sale-record">
            <p><strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}</p>
            <ul>
              {sale.items.map((item, i) => (
                <li key={i}>{item.name} x {item.quantity}</li>
              ))}
            </ul>
            <button onClick={() => handleReorder(sale.items)}>Reorder</button>
          </div>
        ))
      )}
    </div>
  );
}