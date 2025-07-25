'use client';

import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import ProductForm from './ProductForm';

export default function InventoryList() {
  const { user } = useUserContext();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPriceId, setEditPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Add quantity handler
  const handleAddQuantity = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, inventory: { ...p.inventory, unitsInStock: p.inventory.unitsInStock + 1 } }
          : p
      )
    );
  };

  // Edit price handler
  const handleEditPrice = (id, price) => {
    setEditPriceId(id);
    setNewPrice(price);
  };
  const handleSavePrice = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, pricing: { ...p.pricing, price: Number(newPrice) } }
          : p
      )
    );
    setEditPriceId(null);
    setNewPrice('');
  };

  // Edit product handler
  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setEditFields({
      name: product.name,
      category: product.category,
      unitsInStock: product.inventory.unitsInStock,
      unitsSold: product.inventory.unitsSold,
      price: product.pricing.price,
    });
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: name === 'price' || name === 'unitsInStock' || name === 'unitsSold' ? Number(value) : value }));
  };

  const handleSaveInlineEdit = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editFields.name,
              category: editFields.category,
              pricing: { ...p.pricing, price: editFields.price },
              inventory: { ...p.inventory, unitsInStock: editFields.unitsInStock, unitsSold: editFields.unitsSold },
            }
          : p
      )
    );
    setEditingId(null);
    setEditFields({});
  };

  const handleCancelInlineEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  // Add product handler
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Save (add or update) product
  const handleSaveProduct = (formData) => {
    if (formData.id) {
      // Update
      setProducts((prev) =>
        prev.map((p) =>
          p.id === formData.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                pricing: { ...p.pricing, price: formData.price, discount: formData.discount },
                inventory: { ...p.inventory, unitsInStock: formData.stock, unitsSold: formData.unitsSold },
                expiryDate: formData.expiry,
              }
            : p
        )
      );
    } else {
      // Add new
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          name: formData.name,
          category: formData.category,
          pricing: { price: formData.price, discount: formData.discount },
          inventory: { unitsInStock: formData.stock, unitsSold: formData.unitsSold },
          expiryDate: formData.expiry,
        },
      ]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex flex-col items-center w-full mx-[30px]">
      <div className="w-full flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto w-full">
        <div className="bg-white rounded shadow p-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Sold</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Edit</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const { id, name, category, pricing, inventory } = product;
                return (
                  <React.Fragment key={id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4">{id}</td>
                      <td className="py-2 px-4">{name}</td>
                      <td className="py-2 px-4">{category}</td>
                      <td className="py-2 px-4">{inventory.unitsInStock}</td>
                      <td className="py-2 px-4">{inventory.unitsSold}</td>
                      <td className="py-2 px-4">Ksh {pricing.price.toFixed(2)}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => handleEditProduct(product)}
                          disabled={editingId !== null && editingId !== id}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    {editingId === id && (
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4"></td>
                        <td className="py-2 px-4">
                          <input
                            name="name"
                            value={editFields.name}
                            onChange={handleEditFieldChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            name="category"
                            value={editFields.category}
                            onChange={handleEditFieldChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            name="unitsInStock"
                            type="number"
                            value={editFields.unitsInStock}
                            onChange={handleEditFieldChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            name="unitsSold"
                            type="number"
                            value={editFields.unitsSold}
                            onChange={handleEditFieldChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <input
                            name="price"
                            type="number"
                            value={editFields.price}
                            onChange={handleEditFieldChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                            onClick={() => handleSaveInlineEdit(id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                            onClick={handleCancelInlineEdit}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}
