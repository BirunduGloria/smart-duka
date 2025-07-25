'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext } from '.././context/UserContext';

import Link from "next/link";
import SearchBar from "./SearchBar";
import "../globals.css";
import Footer from './Footer';

export default function NavBar({ onSearch, cartCount }) {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY || window.scrollY < 10) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      <nav className={`navbar p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-transform duration-300 ${showNav ? '' : '-translate-y-full'}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div className="nav-logo text-xl font-bold">Smart Duka</div>
        <SearchBar onSearch={onSearch} />
        <ul className="nav-links flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/cart">Cart ({cartCount || 0})</Link></li>
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
      <div style={{ height: '70px' }} /> {/* Spacer for fixed navbar */}
      <Footer />
    </>
  );
}
