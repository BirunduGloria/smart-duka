'use client';
import { useState, useEffect } from 'react';
import NavBar from '../app/components/NavBar';
import SearchBar from '../app/components/SearchBar';
import './globals.css';

export default function Home() {
  const isAdmin = true;
  const [currency, setCurrency] = useState('KES');
  const [query, setQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const conversionRate = 150;

  const daysFromToday = (dateStr) => {
    const today = new Date();
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

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm.toLowerCase());
  };

  const allProducts = [
    {
      id: 1, name: 'Product A', category: 'Beverages',
      image: 'https://placehold.co/600x400', pricing: { price: 200, discount: 0.1 },
      inventory: { unitsSold: 120, unitsInStock: 3 }, expiryDate: '2025-07-30'
    },
    {
      id: 2, name: 'Product B', category: 'Snacks',
      image: 'https://via.placeholder.com/150', pricing: { price: 500, discount: 0 },
      inventory: { unitsSold: 60, unitsInStock: 10 }, expiryDate: '2025-07-25'
    },
    {
      id: 3, name: 'Product C', category: 'Dairy',
      image: 'https://via.placeholder.com/150', pricing: { price: 150, discount: 0.05 },
      inventory: { unitsSold: 20, unitsInStock: 2 }, expiryDate: '2025-08-20'
    },
    {
      id: 4, name: 'Product D', category: 'Grocery',
      image: 'https://via.placeholder.com/150', pricing: { price: 300, discount: 0 },
      inventory: { unitsSold: 55, unitsInStock: 8 }, expiryDate: '2025-08-01'
    },
    {
      id: 5, name: 'Product E', category: 'Bakery',
      image: 'https://via.placeholder.com/150', pricing: { price: 100, discount: 0.15 },
      inventory: { unitsSold: 70, unitsInStock: 1 }, expiryDate: '2025-07-28'
    },
    {
      id: 6, name: 'Product F', category: 'Canned',
      image: 'https://via.placeholder.com/150', pricing: { price: 250, discount: 0 },
      inventory: { unitsSold: 30, unitsInStock: 6 }, expiryDate: '2025-09-10'
    },
    {
      id: 7, name: 'Product G', category: 'Snacks',
      image: 'https://via.placeholder.com/150', pricing: { price: 180, discount: 0.2 },
      inventory: { unitsSold: 85, unitsInStock: 4 }, expiryDate: '2025-08-05'
    },
    {
      id: 8, name: 'Product H', category: 'Drinks',
      image: 'https://via.placeholder.com/150', pricing: { price: 400, discount: 0 },
      inventory: { unitsSold: 95, unitsInStock: 9 }, expiryDate: '2025-07-27'
    },
    {
      id: 9, name: 'Product I', category: 'Grocery',
      image: 'https://via.placeholder.com/150', pricing: { price: 220, discount: 0.05 },
      inventory: { unitsSold: 40, unitsInStock: 3 }, expiryDate: '2025-08-10'
    },
    {
      id: 10, name: 'Product J', category: 'Beverages',
      image: 'https://via.placeholder.com/150', pricing: { price: 350, discount: 0 },
      inventory: { unitsSold: 110, unitsInStock: 2 }, expiryDate: '2025-07-26'
    },
    {
      id: 11, name: 'Product K', category: 'Clothing',
      image: 'https://via.placeholder.com/150', pricing: { price: 350, discount: 0 },
      inventory: { unitsSold: 110, unitsInStock: 6 }, expiryDate: '2025-07-26'
    }
  ];

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

        {isAdmin && (
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
