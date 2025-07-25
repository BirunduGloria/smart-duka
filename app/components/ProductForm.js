'use client';
import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">{product ? 'Edit' : 'Add'} Product</h2>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          min="0"
          step="0.01"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          min="0"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          min="0"
          max="100"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="number"
          name="unitsSold"
          value={formData.unitsSold}
          onChange={handleChange}
          placeholder="Units Sold"
          min="0"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="date"
          name="expiry"
          value={formData.expiry}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {product ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}