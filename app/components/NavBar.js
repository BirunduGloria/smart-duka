"use client";

import Link from "next/link";
import SearchBar from "./SearchBar"; // ✅ Correct import — assuming file is SearchBar.js
import "../globals.css"; // ✅ Global styles

export default function NavBar() {
  return (
    <nav className="navbar p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="nav-logo text-xl font-bold">Smart Duka</div>

      <SearchBar /> {/* ✅ Reusable Search component */}

      <ul className="nav-links flex space-x-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        <li><Link href="/inventory">Inventory</Link></li>
        <li><Link href="/login">Login</Link></li>
      </ul>
    </nav>
  );
}