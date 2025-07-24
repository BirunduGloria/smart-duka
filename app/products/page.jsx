'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

// Dummy data – replace with API call if needed
const dummyProducts = [
  {
    id: 1,
    name: 'Milk',
    category: 'Dairy',
    price: 2.5,
    discount: 0.2,
    unitsSold: 60,
    stock: 2,
    expiry: '2025-08-01',
  },
  {
    id: 2,
    name: 'Bread',
    category: 'Bakery',
    price: 1.2,
    discount: 0,
    unitsSold: 20,
    stock: 10,
    expiry: '2024-07-25',
  },
  {
    id: 3,
    name: 'Eggs',
    category: 'Dairy',
    price: 3.5,
    discount: 0.1,
    unitsSold: 100,
    stock: 1,
    expiry: '2024-07-28',
  },
];

export default function ProductsPage() {
    return (
    <div>
      <h1>Our Products</h1>
      <ProductCard />
    </div>
  );
}
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const isAdmin = true; // toggle manually for demo

  useEffect(() => {
    // Simulate API fetch
    setProducts(dummyProducts);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
  const updatedCart = [...cart, product];
  setCart(updatedCart);
  setMessage(`${product.name} added to cart!`);

  // Clear message after 2.5s
  setTimeout(() => setMessage(''), 2500);

  // Optional: store cart in localStorage right away
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSave = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = selectedCategory
      ? p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;
    return nameMatch && categoryMatch;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Catalog</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border p-2 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-1/3">
  <label htmlFor="categoryFilter" className="block font-medium mb-1">Filter by Category:</label>
  <select
    id="categoryFilter"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="border p-2 w-full rounded"
  >
    <option value="">All</option>
    {Array.from(new Set(products.map((p) => p.category))).map((cat, i) => (
      <option key={i} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>
</div>

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      {message && (
  <div className="bg-green-100 text-green-800 p-2 rounded mb-4 shadow">
    {message}
  </div>
)}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onAddToCart={handleAddToCart}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">🛒 Your Cart ({cart.length} items)</h2>
        <ul className="list-disc pl-6">
          {cart.map((item, index) => (
            <li key={index}>{item.name} - ${item.price}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
