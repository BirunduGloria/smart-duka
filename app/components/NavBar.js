'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext } from '.././context/UserContext';

import Link from "next/link";
import SearchBar from "./SearchBar";

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
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            🛒 Smart Duka
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link href="/" className="navbar-link">
              Home
            </Link>
            <Link href="/products" className="navbar-link">
              Products
            </Link>
            <Link href="/cart" className="navbar-link relative">
              Cart
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>
            {user?.role === 'admin' && (
              <Link href="/inventory" className="navbar-link">
                Inventory
              </Link>
            )}
            {user ? (
              <button 
                onClick={handleLogout} 
                className="navbar-button"
              >
                Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                className="navbar-login"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="navbar-link">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
