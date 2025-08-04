'use client';

import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext';
import ProductForm from './ProductForm';
import { fetchProducts, getProductStats } from '../utils/productData';

export default function InventoryList() {
  const { user } = useUserContext();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPriceId, setEditPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [productsData, statsData] = await Promise.all([
          fetchProducts(),
          getProductStats()
        ]);
        
        setProducts(productsData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load inventory data');
        console.error('Error loading inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
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
    setEditFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editFields.name,
              category: editFields.category,
              pricing: { ...p.pricing, price: Number(editFields.price) },
              inventory: { 
                ...p.inventory, 
                unitsInStock: Number(editFields.unitsInStock), 
                unitsSold: Number(editFields.unitsSold) 
              },
            }
          : p
      )
    );
    setEditingId(null);
    setEditFields({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium">Total Products</h3>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-medium">Total Stock</h3>
            <p className="text-2xl font-bold">{stats.totalStock}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-medium">Low Stock Items</h3>
            <p className="text-2xl font-bold">{stats.lowStockItems}</p>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-medium">Expiring Soon</h3>
            <p className="text-2xl font-bold">{stats.expiringSoon}</p>
          </div>
        </div>
      )}

      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSubmit={(newProduct) => {
            setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
            setShowForm(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddQuantity(product.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                >
                  +1
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>

            {editingId === product.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={editFields.name}
                  onChange={handleEditFieldChange}
                  className="w-full p-2 border rounded"
                  placeholder="Product name"
                />
                <input
                  type="text"
                  name="category"
                  value={editFields.category}
                  onChange={handleEditFieldChange}
                  className="w-full p-2 border rounded"
                  placeholder="Category"
                />
                <input
                  type="number"
                  name="unitsInStock"
                  value={editFields.unitsInStock}
                  onChange={handleEditFieldChange}
                  className="w-full p-2 border rounded"
                  placeholder="Stock"
                />
                <input
                  type="number"
                  name="price"
                  value={editFields.price}
                  onChange={handleEditFieldChange}
                  className="w-full p-2 border rounded"
                  placeholder="Price"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(product.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Category: {product.category}</p>
                <p className="text-gray-600 mb-2">Stock: {product.inventory.unitsInStock}</p>
                <p className="text-gray-600 mb-2">Sold: {product.inventory.unitsSold}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.pricing.price}
                  </span>
                  {editPriceId === product.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-20 p-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => handleSavePrice(product.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditPrice(product.id, product.pricing.price)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit Price
                    </button>
                  )}
                </div>
                {product.expiryDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    Expires: {product.expiryDate}
                  </p>
                )}
                {product.pricing.discount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    {Math.round(product.pricing.discount * 100)}% OFF
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
