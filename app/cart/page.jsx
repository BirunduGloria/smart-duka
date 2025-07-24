'use client'; // Needed if Cart uses useState/useEffect or browser-only logic

import Cart from '../components/Cart';

export default function CartPage() {
  return (
    <main>
      <h1>Your Cart</h1>
      <Cart />
    </main>
  );
}
