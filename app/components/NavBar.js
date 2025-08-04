'use client';

import Link from 'next/link';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function NavBar({ onSearch, cartCount = 0 }) {
  const { user, logout } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{ 
      background: 'linear-gradient(to right, #1e3a8a, #1f2937)', 
      padding: '16px 0', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: 'white', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            Smart Duka
          </Link>
          
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ 
                width: '256px', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                border: 'none',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.3s ease'
          }}>
            Home
          </Link>
          
          <Link href="/products" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.3s ease'
          }}>
            Products
          </Link>
          
          <Link href="/cart" style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.3s ease',
            position: 'relative'
          }}>
            Cart
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '-8px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                fontSize: '12px', 
                borderRadius: '50%', 
                width: '20px', 
                height: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold' 
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          
          {user && user.role === 'admin' && (
            <Link href="/inventory" style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}>
              Inventory
            </Link>
          )}
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'white', fontWeight: '500' }}>
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                style={{ 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                href="/login"
                style={{ 
                  backgroundColor: '#1e40af', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                style={{ 
                  backgroundColor: '#1e40af', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
