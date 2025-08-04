// Example: How to fetch product data from db.json in your components

import { useState } from 'react';
import { fetchProductsFromDb, fetchEnhancedProductsFromDb, fetchProductCatalog } from '../utils/productData';

// Example 1: Basic usage in a React component
export function useProductData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products from db.json (cart and sales data)
      const dbProducts = await fetchProductsFromDb();
      setProducts(dbProducts);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
}

// Example 2: Fetch enhanced product data with transaction information
export function useEnhancedProductData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnhancedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch enhanced products from db.json with transaction data
      const enhancedProducts = await fetchEnhancedProductsFromDb();
      setProducts(enhancedProducts);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchEnhancedProducts };
}

// Example 3: Fetch from both data sources
export function useAllProductData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from both db.json and products.json
      const [dbProducts, catalogProducts] = await Promise.all([
        fetchEnhancedProductsFromDb(),
        fetchProductCatalog()
      ]);
      
      setData({
        dbProducts,
        catalogProducts,
        allProducts: [...dbProducts, ...catalogProducts]
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchAllData };
}

// Example 4: Simple function to get products from db.json
export async function getProductsFromDb() {
  try {
    const products = await fetchProductsFromDb();
    console.log('Products from db.json:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products from db.json:', error);
    return [];
  }
}

// Example 5: Function to get unique products with their total quantities
export async function getProductSummaryFromDb() {
  try {
    const products = await fetchEnhancedProductsFromDb();
    
    const summary = products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      totalQuantity: product.totalQuantity,
      sources: product.sources,
      lastSeen: product.lastSeen
    }));
    
    console.log('Product summary from db.json:', summary);
    return summary;
  } catch (error) {
    console.error('Error fetching product summary from db.json:', error);
    return [];
  }
} 