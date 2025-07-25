'use client';
import { useState, useEffect } from 'react';
import NavBar from '../app/components/NavBar';
import SearchBar from '../app/components/SearchBar';
import './globals.css';
import LayoutWrapper from './LayoutWrapper';

function Home() {
  const isAdmin = true;
  const [currency, setCurrency] = useState('KES');
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const conversionRate = 150;
  const [today, setToday] = useState(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const daysFromToday = (dateStr) => {
    if (!today) return Infinity;
    const expiry = new Date(dateStr);
    return (expiry - today) / (1000 * 60 * 60 * 24);
  };

  const loadCart = () => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('cart')) || [];
  };

  const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const addToCart = (product) => {
    const cart = loadCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    alert(`${product.name} added to cart`);
  };

  useEffect(() => {
    const cart = loadCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm.toLowerCase());
  };

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  const formatPrice = (price) => {
    const converted = currency === 'USD' ? (price / conversionRate).toFixed(2) : price;
    return currency === 'USD' ? `$ ${converted}` : `KSh ${converted}`;
  };

  return (
    <>
      <NavBar onSearch={handleSearch} cartCount={cartCount} />

      <main className="main-container">
        <div className="header-section standout-header">
          <h1>Welcome to Smart-Duka</h1>
          <div className="currency-selector">
            <label>Currency:</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <section className="section standout-section">
          <h2>Featured Products</h2>
          <ul className="product-grid standout-grid">
            {filteredProducts
              .filter((p) => p.pricing.discount > 0)
              .map((product) => (
                <li key={product.id} className="product-card standout-card">
                  <div className="image-container">
                    <img src={product.image} alt={product.name} />
                    <span className="discount-badge">
                      -{(product.pricing.discount * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">{formatPrice(product.pricing.price)}</p>
                  <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </li>
              ))}
          </ul>
        </section>

        <section className="section standout-section">
          <h2>Fast Selling Products</h2>
          <ul className="product-grid standout-grid">
            {filteredProducts
              .filter((p) => p.inventory.unitsSold > 50)
              .map((product) => (
                <li key={product.id} className="product-card standout-card">
                  <img src={product.image} alt={product.name} />
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">{formatPrice(product.pricing.price)}</p>
                  <p className="product-units">{product.inventory.unitsSold} units sold</p>
                  <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </li>
              ))}
          </ul>
        </section>

        <section className="section standout-section">
          <h2>Smart Stock Alerts</h2>
          <ul className="alert-list standout-alert">
            {filteredProducts
              .filter((p) => p.inventory.unitsInStock < 5)
              .map((product) => (
                <li key={product.id}>
                  <span className="product-name">{product.name}</span> – only {product.inventory.unitsInStock} left
                  <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                </li>
              ))}
          </ul>
        </section>

        {isAdmin && today && (
          <section className="section standout-section">
            <h2>Expiring Soon</h2>
            <ul className="alert-list standout-alert expiring">
              {filteredProducts
                .filter((p) => daysFromToday(p.expiryDate) <= 7)
                .map((product) => (
                  <li key={product.id}>
                    <span className="product-name">{product.name}</span> – expiring soon ({product.expiryDate})
                  </li>
                ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <LayoutWrapper>
      <Home />
    </LayoutWrapper>
  );
}
