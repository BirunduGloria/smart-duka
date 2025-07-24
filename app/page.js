import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">SmartPOS</div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/inventory">Inventory</Link></li>
      </ul>
    </nav>
  );
}
