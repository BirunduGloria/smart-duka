'use client';
import React, { useState } from 'react';
import styles from './ProductForm.module.css';

export default function ProductForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    id: initialData.id || '',
    name: initialData.name || '',
    category: initialData.category || '',
    image: initialData.image || '',
    pricing: {
      price: initialData.pricing?.price || '',
      discount: initialData.pricing?.discount || '',
    },
    inventory: {
      unitsInStock: initialData.inventory?.unitsInStock || '',
      unitsSold: initialData.inventory?.unitsSold || '',
    },
    expiryDate: initialData.expiryDate || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('pricing.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [key]: value,
        },
      }));
    } else if (name.startsWith('inventory.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          [key]: value,
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
    const formattedData = {
      ...formData,
      id: parseInt(formData.id),
      pricing: {
        price: parseFloat(formData.pricing.price),
        discount: parseFloat(formData.pricing.discount),
      },
      inventory: {
        unitsInStock: parseInt(formData.inventory.unitsInStock),
        unitsSold: parseInt(formData.inventory.unitsSold),
      },
    };
    onSubmit(formattedData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="number"
        name="id"
        placeholder="ID"
        value={formData.id}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="number"
        step="0.01"
        name="pricing.price"
        placeholder="Price"
        value={formData.pricing.price}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="number"
        step="0.01"
        name="pricing.discount"
        placeholder="Discount"
        value={formData.pricing.discount}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="number"
        name="inventory.unitsInStock"
        placeholder="Units In Stock"
        value={formData.inventory.unitsInStock}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="number"
        name="inventory.unitsSold"
        placeholder="Units Sold"
        value={formData.inventory.unitsSold}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="date"
        name="expiryDate"
        value={formData.expiryDate}
        onChange={handleChange}
        className={styles.input}
      />

      <button type="submit" className={styles.submitBtn}>Submit</button>
    </form>
  );
}
