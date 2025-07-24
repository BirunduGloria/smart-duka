import React from "react";

export default function CartTotal({ total, currency }) {
  const formatCurrency = (amount) => {
    return currency === "USD"
      ? `$${(amount / 100).toFixed(2)}`
      : `KES ${amount.toFixed(0)}`;
  };

  return (
    <div className="cart-total">
      <h3>Total: {formatCurrency(total)}</h3>
    </div>
  );
}
