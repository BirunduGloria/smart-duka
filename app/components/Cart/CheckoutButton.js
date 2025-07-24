import React from "react";

export default function CheckoutButton({ cartItems }) {
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const response = await fetch("http://localhost:3001/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        date: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      alert("Sale submitted successfully!");
      localStorage.removeItem("cart");
      window.location.reload(); 
    } else {
      alert("Checkout failed. Try again.");
    }
  };

  return (
    <button onClick={handleCheckout} className="checkout-btn">
      Checkout
    </button>
  );
}
