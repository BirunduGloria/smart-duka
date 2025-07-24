'use client';

import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Link from "next/link";
import SearchBar from "./SearchBar";
import "../globals.css";

export default function NavBar({ onSearch }) {
  const { user } = useContext(UserContext); 

  return (
    <nav className="navbar p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="nav-logo text-xl font-bold">Smart Duka</div>

      <SearchBar onSearch={onSearch} />

      <ul className="nav-links flex space-x-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        {user?.role === 'admin' && (
          <li><Link href="/inventory">Inventory</Link></li>
        )}
        <li><Link href="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
