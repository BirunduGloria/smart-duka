'use client';
import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    image: '',
    pricing: {
      price: 0,
      discount: 0,
    },
    inventory: {
      unitsInStock: 0,
      unitsSold: 0,
    },
    expiryDate: '',
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    setMessage(`${product.name} added to cart!`);

    setTimeout(() => setMessage(''), 2500);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };


    if (name === 'price' || name === 'discount') {
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [name]: Number(value),
        },
      }));
    } else if (name === 'unitsInStock' || name === 'unitsSold') {
      setFormData((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [name]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim()) {
      alert('Name and Category are required');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} className="product-form">
        <h2>{product ? 'Edit' : 'Add'} Product</h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="form-input"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="form-input"
        />

        <div className="w-1/3">
 
          <label htmlFor="categoryFilter" className="block font-medium mb-1">
            Filter by Category:
          </label>

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


        <input
          type="number"
          name="price"
          value={formData.pricing.price}
          onChange={handleChange}
          placeholder="Price"
          min="0"
          step="0.01"
          className="form-input"
        />

        <input
          type="number"
          name="unitsInStock"
          value={formData.inventory.unitsInStock}
          onChange={handleChange}
          placeholder="Units in Stock"
          min="0"
          className="form-input"
        />

        <input
          type="number"
          name="discount"
          value={formData.pricing.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          min="0"
          max="100"
          className="form-input"
        />

        <input
          type="number"
          name="unitsSold"
          value={formData.inventory.unitsSold}
          onChange={handleChange}
          placeholder="Units Sold"
          min="0"
          className="form-input"
        />

        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="form-input"
        />

        <div className="button-group">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {product ? 'Update' : 'Add'}
          </button>
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
        <h2 className="text-xl font-semibold">
          🛒 Your Cart ({cart.length} items)
        </h2>
        <ul className="list-disc pl-6">
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
