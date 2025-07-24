'use client';
import React, { useState, useEffect } from 'react';
import styles from './ProductCard.module.css';

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    price: 0,
    stock: 0,
    discount: 0,
    unitsSold: 0,
    expiry: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || null,
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        stock: product.stock || 0,
        discount: product.discount || 0,
        unitsSold: product.unitsSold || 0,
        expiry: product.expiry || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        ['price', 'stock', 'discount', 'unitsSold'].includes(name)
          ? Number(value)
          : value,
    }));
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
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-form">
        <h2 className="modal-title">{product ? 'Edit' : 'Add'} Product</h2>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="input" />
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="input" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" min="0" step="0.01" className="input" />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" min="0" className="input" />
        <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="Discount (%)" min="0" max="100" className="input" />
        <input type="number" name="unitsSold" value={formData.unitsSold} onChange={handleChange} placeholder="Units Sold" min="0" className="input" />
        <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} className="input" />

        <div className="modal-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          <button type="submit" className="save-btn">{product ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
}
