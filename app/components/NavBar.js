// app/components/NavBar.js

import Link from "next/link";
import { UserContext } from "../context/UserContext";
import { useRouter } from "next/navigation";
import "../globals.css"; // You can move styles to a separate CSS file if needed

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">SmartPOS</div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/cart">Cart</Link></li>
        {user?.role === "admin" && (
          <li><Link href="/inventory">Inventory</Link></li>
        )}
        {user ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li><Link href="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}