'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '.././context/UserContext.js';
import Link from "next/link";
import SearchBar from "./SearchBar";
import "../globals.css";

export default function NavBar({ onSearch }) {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="navbar p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="nav-logo text-xl font-bold">Smart Duka</div>

      <SearchBar onSearch={onSearch} />

      <ul className="nav-links flex space-x-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/Products">products</Link></li>
        <li><Link href="/cart">Cart</Link></li>


        {user?.role === 'admin' && (
          <li><Link href="/inventory">Inventory</Link></li>
        )}

        {user ? (
          <li>
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Logout
            </button>
          </li>
        ) : (
          <li><Link href="/login">Login</Link></li>
        )}

      </ul>
    </nav>
  );
}
