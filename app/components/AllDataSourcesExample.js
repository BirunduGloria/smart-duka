'use client';

import { useState, useEffect } from 'react';
import { 
  fetchProductsFromDb, 
  fetchProductCatalog, 
  getMockProducts, 
  fetchProductsFromAPI,
  getAllProductData,
  getProductSummary
} from '../utils/productData';

export default function AllDataSourcesExample() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allData, productSummary] = await Promise.all([
        getAllProductData(),
        getProductSummary()
      ]);
      
      setData(allData);
      setSummary(productSummary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading all data sources...</p>
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Data Sources Overview</h1>
      
      {/* Summary Section */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium">db.json</h3>
              <p className="text-2xl font-bold">{summary.sources.dbJson}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium">Product Catalog</h3>
              <p className="text-2xl font-bold">{summary.sources.productCatalog}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="font-medium">API Server</h3>
              <p className="text-2xl font-bold">{summary.sources.apiServer}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h3 className="font-medium">Mock Data</h3>
              <p className="text-2xl font-bold">{summary.sources.mockData}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">Total Unique Products</h3>
              <p className="text-2xl font-bold">{summary.totalUniqueProducts}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">Categories</h3>
              <p className="text-sm">{summary.categories.join(', ')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium">Price Range</h3>
              <p className="text-sm">${summary.priceRange.min} - ${summary.priceRange.max}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources */}
      {data && (
        <div className="space-y-6">
          {/* db.json Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">db.json Products (Transactional Data)</h2>
            <p className="text-gray-600 mb-4">Products extracted from cart and sales transactions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.dbProducts.map((product) => (
                <div key={product.id} className="border p-3 rounded">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">Total Quantity: {product.totalQuantity}</p>
                  <p className="text-gray-600">Sources: {product.sources.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Catalog */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Product Catalog (Master Data)</h2>
            <p className="text-gray-600 mb-4">Complete product catalog with detailed information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.catalogProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="border p-3 rounded">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-gray-600">Category: {product.category}</p>
                  <p className="text-gray-600">Price: ${product.pricing.price}</p>
                  <p className="text-gray-600">Stock: {product.inventory.unitsInStock}</p>
                </div>
              ))}
              {data.catalogProducts.length > 6 && (
                <div className="col-span-full text-center text-gray-500">
                  + {data.catalogProducts.length - 6} more products
                </div>
              )}
            </div>
          </div>

          {/* API Server Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">API Server Products (localhost:3003)</h2>
            <p className="text-gray-600 mb-4">Products from external JSON server API</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.apiProducts.map((product) => (
                <div key={product.id} className="border p-3 rounded">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">Quantity: {product.quantity}</p>
                  <p className="text-gray-600">Source: {product.source}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mock Products (Hardcoded)</h2>
            <p className="text-gray-600 mb-4">Static product data from page.js</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.mockProducts.map((product) => (
                <div key={product.id} className="border p-3 rounded">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-gray-600">Category: {product.category}</p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">Stock: {product.stock}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchAllData}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Refresh All Data
        </button>
      </div>
    </div>
  );
} 