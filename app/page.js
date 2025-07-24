'use client';
import { useState } from 'react';
import NavBar from '../app/components/NavBar';
import './globals.css';


export default function Home() {
  const isAdmin = true;

  const [currency, setCurrency] = useState('KES');

  const conversionRate = 150; // 1 USD = 150 KES

  const products = [
    { id: 1, name: 'Product A', price: 200, discount: true, unitsSold: 120, stock: 3, expiresSoon: false, image: 'https://placehold.co/600x400' },
    { id: 2, name: 'Product B', price: 500, discount: false, unitsSold: 60, stock: 10, expiresSoon: true, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product C', price: 150, discount: true, unitsSold: 20, stock: 2, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product D', price: 300, discount: false, unitsSold: 55, stock: 8, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Product E', price: 100, discount: true, unitsSold: 70, stock: 1, expiresSoon: true, image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Product F', price: 250, discount: false, unitsSold: 30, stock: 6, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Product G', price: 180, discount: true, unitsSold: 85, stock: 4, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Product H', price: 400, discount: false, unitsSold: 95, stock: 9, expiresSoon: true, image: 'https://via.placeholder.com/150' },
    { id: 9, name: 'Product I', price: 220, discount: true, unitsSold: 40, stock: 3, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 10, name: 'Product J', price: 350, discount: false, unitsSold: 110, stock: 2, expiresSoon: true, image: 'https://via.placeholder.com/150' },
  ];

  const formatPrice = (price) => {
    if (currency === 'USD') {
      return `$ ${(price / conversionRate).toFixed(2)}`;
    }
    return `KSh ${price}`;
  };

  return (
    <>
      <NavBar />
      <main className="main-container">
        <div className="header-section standout-header">
          <h1>Welcome to E-Shop</h1>
          <div className="currency-selector">
            <label>currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <section className="section standout-section">
          <h2>Featured Products</h2>
          <ul className="product-grid standout-grid">
            {products.filter(p => p.discount).map(product => (
              <li key={product.id} className="product-card standout-card">
                <div className="image-container">
                  <img src={product.image} alt={product.name} />
                  <span className="discount-badge">Discount</span>
                </div>
                <p className="product-name">{product.name}</p>
                <p className="product-price">{formatPrice(product.price)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section standout-section">
          <h2>Fast Selling Products</h2>
          <ul className="product-grid standout-grid">
            {products.filter(p => p.unitsSold > 50).map(product => (
              <li key={product.id} className="product-card standout-card">
                <img src={product.image} alt={product.name} />
                <p className="product-name">{product.name}</p>
                <p className="product-price">{formatPrice(product.price)}</p>
                <p className="product-units">{product.unitsSold} units sold</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="section standout-section">
          <h2>Smart Stock Alerts</h2>
          <ul className="alert-list standout-alert">
            {products.filter(p => p.stock < 5).map(product => (
              <li key={product.id}>
                <span className="product-name">{product.name}</span> - only {product.stock} left
              </li>
            ))}
          </ul>
        </section>

        {isAdmin && (
          <section className="section standout-section">
            <h2>Expiring Soon</h2>
            <ul className="alert-list standout-alert expiring">
              {products.filter(p => p.expiresSoon).map(product => (
                <li key={product.id}>
                  <span className="product-name">{product.name}</span> - expiring soon
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}