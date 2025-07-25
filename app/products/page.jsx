'use client';
import React, { useState, useContext } from 'react';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';
import ProductsData from './ProductsData.json'; // Adjust path if needed
import NavBar from '../components/NavBar';
import { UserContext } from '../context/UserContext';

// Extract unique categories
const categories = [
  'All',
  ...Array.from(new Set(ProductsData.map((p) => p.category)))
];

export default function ProductsPage() {
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('products');
      return stored ? JSON.parse(stored) : ProductsData;
    }
    return ProductsData;
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin';

  const displayedProducts = showAll ? products : products.slice(0, 5);

  // Helper to update state and localStorage
  const updateProducts = (newProducts) => {
    setProducts(newProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(newProducts));
    }
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSave = (updatedProduct) => {
    let updatedList;
    if (updatedProduct.id != null) {
      // Update existing product
      updatedList = products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );
    } else {
      // Add new product with new ID
      const newProduct = {
        ...updatedProduct,
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      };
      updatedList = [...products, newProduct];
    }
    updateProducts(updatedList);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    // Implement your cart logic here
    alert(`${product.name} added to cart!`);
  };

  const handleDelete = (productId) => {
    const updatedList = products.filter((p) => p.id !== productId);
    updateProducts(updatedList);
  };

  // Combined search and filter
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchQuery, category);
  };

  const filterProducts = (query, category) => {
    let filtered = ProductsData;
    if (query) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    setProducts(filtered);
  };

  return (
    <div className="page-container">
      <NavBar onSearch={handleSearch} />
      <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600, fontSize: '1.4rem', textAlign: 'left' }}>Display All Products</h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}
      >
        <label htmlFor="category-select">Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ minWidth: 120 }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {!showAll && (
          <button
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              border: '1px solid #ccc',
              background: '#f8f8fa',
              cursor: 'pointer',
            }}
            onClick={() => setShowAll(true)}
          >
            Display All Products
          </button>
        )}
        {isAdmin && (
          <button
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              border: '1px solid #22c55e',
              background: '#22c55e',
              color: '#fff',
              cursor: 'pointer',
            }}
            onClick={handleAddClick}
          >
            Add Product
          </button>
        )}
      </div>
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <div className="products-grid">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onAddToCart={handleAddToCart}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
