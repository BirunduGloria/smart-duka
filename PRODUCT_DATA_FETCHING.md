# Product Data Fetching from db.json

This document explains how to fetch product data from the `db.json` file in your Smart Duka application.

## Overview

The `db.json` file contains transactional data including:
- **Cart items**: Products currently in user carts
- **Sales records**: Historical sales transactions with product details

## Available Functions

### 1. `fetchProductsFromDb()`
Fetches basic product information from cart and sales data in `db.json`.

**Returns:**
```javascript
[
  {
    id: 1,
    name: "Fresh Milk",
    price: 100,
    category: "General",
    image: null,
    stock: 0,
    quantity: 2
  }
]
```

**Usage:**
```javascript
import { fetchProductsFromDb } from './utils/productData';

const products = await fetchProductsFromDb();
console.log('Products from db.json:', products);
```

### 2. `fetchEnhancedProductsFromDb()`
Fetches products with enhanced transaction data including quantities and sources.

**Returns:**
```javascript
[
  {
    id: 1,
    name: "Fresh Milk",
    price: 100,
    totalQuantity: 8,
    sources: ["cart", "sales"],
    lastSeen: "2025-07-24T19:00:13.451Z"
  }
]
```

**Usage:**
```javascript
import { fetchEnhancedProductsFromDb } from './utils/productData';

const enhancedProducts = await fetchEnhancedProductsFromDb();
console.log('Enhanced products:', enhancedProducts);
```

### 3. `fetchProductCatalog()`
Fetches the complete product catalog from `public/data/products.json`.

**Returns:**
```javascript
[
  {
    id: 1,
    name: "Milk",
    category: "Food",
    image: "https://...",
    pricing: { price: 2.5, discount: 0.2 },
    inventory: { unitsInStock: 2, unitsSold: 60 },
    expiryDate: "2025-08-01"
  }
]
```

**Usage:**
```javascript
import { fetchProductCatalog } from './utils/productData';

const catalog = await fetchProductCatalog();
console.log('Product catalog:', catalog);
```

### 4. `getAllProductData()`
Fetches data from both sources and provides a summary.

**Returns:**
```javascript
{
  dbProducts: [...], // From db.json
  catalogProducts: [...], // From products.json
  totalProducts: 17
}
```

**Usage:**
```javascript
import { getAllProductData } from './utils/productData';

const allData = await getAllProductData();
console.log('All product data:', allData);
```

## React Hook Examples

### Basic Product Hook
```javascript
import { useState } from 'react';
import { fetchProductsFromDb } from './utils/productData';

export function useProductData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
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

  return { products, loading, error, fetchProducts };
}
```

### Enhanced Product Hook
```javascript
export function useEnhancedProductData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnhancedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEnhancedProductsFromDb();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchEnhancedProducts };
}
```

## Component Usage Example

```javascript
'use client';

import { useProductData } from './utils/productData';

export default function ProductList() {
  const { products, loading, error, fetchProducts } = useProductData();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products from db.json</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Data Sources

### db.json Structure
```json
{
  "cart": [
    {
      "id": 1,
      "name": "Fresh Milk",
      "price": 100,
      "quantity": 2
    }
  ],
  "sales": [
    {
      "id": "bd80",
      "items": [
        {
          "id": 1,
          "name": "Fresh Milk",
          "price": 100,
          "quantity": 2
        }
      ],
      "date": "2025-07-24T11:06:09.257Z",
      "total": 280
    }
  ]
}
```

### products.json Structure
```json
[
  {
    "id": 1,
    "name": "Milk",
    "category": "Food",
    "image": "https://...",
    "pricing": { "price": 2.5, "discount": 0.2 },
    "inventory": { "unitsInStock": 2, "unitsSold": 60 },
    "expiryDate": "2025-08-01"
  }
]
```

## API Endpoints

- `/api/db` - Serves the contents of `db.json`
- `/data/products.json` - Serves the product catalog

## Error Handling

All functions include proper error handling and will throw descriptive errors if:
- The API endpoint is not available
- The JSON data is malformed
- Network requests fail

## Notes

- Products from `db.json` are extracted from cart and sales transactions
- The `db.json` data represents transactional data, not a master product catalog
- For a complete product catalog, use `products.json`
- The enhanced functions aggregate quantities across multiple transactions
- All functions are async and return Promises 