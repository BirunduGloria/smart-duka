// app/components/NavBar.js

import Link from "next/link";
import "../globals.css"; // You can move styles to a separate CSS file if needed

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">SmartPOS</div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/Products">products</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        <li><Link href="/inventory">Inventory</Link></li>
        <li><Link href="/login">Login</Link></li>
      </ul>
    </nav>
  );
}