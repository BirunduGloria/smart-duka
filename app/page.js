'use client';

import { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';

export default function Home() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('KES');

  useEffect(() => {
    // Simulate fetching products
    const mockProducts = [
      {
        id: 1,
        name: "Fresh Tomatoes",
        price: 150,
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400",
        category: "Vegetables",
        stock: 50,
        expiryDate: "2024-02-15"
      },
      {
        id: 2,
        name: "Organic Bananas",
        price: 200,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
        category: "Fruits",
        stock: 30,
        expiryDate: "2024-02-10"
      },
      {
        id: 3,
        name: "Fresh Milk",
        price: 120,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
        category: "Dairy",
        stock: 25,
        expiryDate: "2024-02-08"
      },
      {
        id: 4,
        name: "Whole Grain Bread",
        price: 80,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
        category: "Bakery",
        stock: 40,
        expiryDate: "2024-02-12"
      },
      {
        id: 5,
        name: "Free Range Eggs",
        price: 300,
        image: "https://images.unsplash.com/photo-1569288063648-5d2196e4b6c0?w=400",
        category: "Dairy",
        stock: 60,
        expiryDate: "2024-02-20"
      },
      {
        id: 6,
        name: "Organic Spinach",
        price: 100,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
        category: "Vegetables",
        stock: 35,
        expiryDate: "2024-02-09"
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const formatPrice = (price) => {
    const exchangeRate = currency === 'USD' ? 0.007 : 1;
    const convertedPrice = price * exchangeRate;
    const symbol = currency === 'USD' ? '$' : 'KSh';
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <NavBar onSearch={handleSearch} cartCount={cartCount} />
      
      <main className="main-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="standout-header">
            <h1 className="text-4xl font-bold mb-4">Welcome to Smart-Duka</h1>
            <p className="text-xl mb-6">Discover amazing products at unbeatable prices</p>
            
            {/* Currency Selector */}
            <div className="currency-selector">
              <label className="font-medium">Currency:</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <section className="standout-section">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Featured Products</h2>
            <div className="standout-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="standout-card">
                  <div className="image-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                    />
                    {product.stock < 10 && (
                      <div className="discount-badge">
                        Low Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{product.category}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-3">{formatPrice(product.price)}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fast Selling Products */}
        <section className="standout-section">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Fast Selling Products</h2>
            <div className="standout-grid">
              {filteredProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="standout-card">
                  <div className="image-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                    />
                    <div className="discount-badge">
                      Popular
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">{product.category}</p>
                    <p className="text-2xl font-bold text-green-600 mb-3">{formatPrice(product.price)}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Smart Stock Alerts */}
        <section className="standout-section">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Smart Stock Alerts</h2>
            <div className="standout-alert">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">Low Stock Items</h3>
              <div className="space-y-2">
                {filteredProducts.filter(p => p.stock < 10).map((product) => (
                  <div key={product.id} className="flex justify-between items-center bg-white p-3 rounded">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-red-600 font-bold">Only {product.stock} left!</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Expiring Soon */}
        <section className="standout-section">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Expiring Soon</h2>
            <div className="standout-alert">
              <h3 className="text-xl font-semibold text-red-800 mb-4">Items Expiring This Week</h3>
              <div className="space-y-2">
                {filteredProducts.slice(0, 2).map((product) => (
                  <div key={product.id} className="flex justify-between items-center bg-white p-3 rounded">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-red-600 font-bold">Expires: {product.expiryDate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
