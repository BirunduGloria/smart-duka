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

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      </form>
    </div>
  );
}
