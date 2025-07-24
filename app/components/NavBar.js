'use client';

import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Link from "next/link";
import "../globals.css";

export default function NavBar() {
  const { user } = useContext(UserContext); 

  return (
    <nav className="navbar">
      <div className="nav-logo">SmartPOS</div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        {user && user.role === 'admin' ? (
          <li><Link href="/inventory">Inventory</Link></li>
        ) : null} {/*we have a condition to only show this if an admin is loggedin*/}
        <li><Link href="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
