'use client';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, currency } = useCart();

  const convert = (priceKES) => currency === 'KES' ? priceKES : (priceKES / 160).toFixed(2);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleCheckout = () => {
    fetch('http://localhost:3006/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: cartItems, total }),
    }).then(() => {
      alert('Purchase complete!');
    });
  };

  return (
    <main>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - Qty:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                />
                Subtotal: {currency} {convert(item.price * item.quantity)}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Total: {currency} {convert(total)}</h2>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </main>
  );
}
