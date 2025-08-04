'use client';

import { useState, useEffect } from 'react';
import { fetchProductsFromDb, fetchEnhancedProductsFromDb, getAllProductData } from '../utils/productData';

export default function ProductDataExample() {
  const [products, setProducts] = useState([]);
  const [enhancedProducts, setEnhancedProducts] = useState([]);
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example 1: Fetch basic products from db.json
  const fetchBasicProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsFromDb();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Fetch enhanced products from db.json
  const fetchEnhancedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEnhancedProductsFromDb();
      setEnhancedProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Fetch all product data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProductData();
      setAllData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product Data from db.json</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Products from db.json */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic Products from db.json</h2>
          <button
            onClick={fetchBasicProducts}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Basic Products'}
          </button>
          
          {products.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Found {products.length} unique products:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border p-3 rounded">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-gray-600">Price: ${product.price}</p>
                    <p className="text-gray-600">Category: {product.category}</p>
                    <p className="text-gray-600">Stock: {product.stock}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Products from db.json */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enhanced Products from db.json</h2>
          <button
            onClick={fetchEnhancedProducts}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch Enhanced Products'}
          </button>
          
          {enhancedProducts.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Found {enhancedProducts.length} products with transaction data:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enhancedProducts.map((product) => (
                  <div key={product.id} className="border p-3 rounded">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-gray-600">Price: ${product.price}</p>
                    <p className="text-gray-600">Total Quantity: {product.totalQuantity}</p>
                    <p className="text-gray-600">Sources: {product.sources.join(', ')}</p>
                    <p className="text-gray-600">Last Seen: {new Date(product.lastSeen).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Product Data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Product Data Sources</h2>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Fetch All Data'}
          </button>
          
          {allData && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Data Summary:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="font-medium">db.json Products</h4>
                  <p className="text-2xl font-bold">{allData.dbProducts.length}</p>
                  <p className="text-sm text-gray-600">From cart & sales data</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h4 className="font-medium">Product Catalog</h4>
                  <p className="text-2xl font-bold">{allData.catalogProducts.length}</p>
                  <p className="text-sm text-gray-600">From products.json</p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <h4 className="font-medium">Total Products</h4>
                  <p className="text-2xl font-bold">{allData.totalProducts}</p>
                  <p className="text-sm text-gray-600">Combined sources</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 