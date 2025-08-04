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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('Main page - Saving cart to localStorage:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    // Dispatch custom event to notify other pages
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products from /products.json...');
        
        const response = await fetch('/products.json');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        
        const productsData = await response.json();
        console.log('Products data loaded:', productsData.length, 'products');
        
        // Transform the data to match the expected format
        const transformedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: product.pricing.price,
          image: product.image,
          category: product.category,
          stock: product.inventory.unitsInStock,
          expiryDate: product.expiryDate,
          discount: product.pricing.discount
        }));
        
        console.log('Transformed products:', transformedProducts.length, 'products');
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(`Failed to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const formatPrice = (price) => {
    const exchangeRate = currency === 'USD' ? 0.007 : 1;
    const convertedPrice = price * exchangeRate;
    const symbol = currency === 'USD' ? '$' : 'KSh';
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <NavBar cartCount={cartCount} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '48px', width: '48px', borderBottom: '2px solid #3b82f6', margin: '0 auto' }}></div>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <NavBar cartCount={cartCount} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#ef4444', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: '#6b7280' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: '16px', backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar onSearch={handleSearch} cartCount={cartCount} />
      
      <main className="flex-1 pt-8 pb-8">
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1f2937 50%, #3b82f6 100%)', 
            color: 'white', 
            padding: '48px 32px', 
            borderRadius: '20px', 
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Animated background elements */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              position: 'relative',
              zIndex: 1
            }}>Welcome to Smart-Duka</h1>
            <p style={{ 
              fontSize: '24px', 
              marginBottom: '24px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              position: 'relative',
              zIndex: 1
            }}>Discover amazing products at unbeatable prices</p>
            
            {/* Currency Selector */}
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              padding: '12px 20px', 
              borderRadius: '12px', 
              marginTop: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              zIndex: 1
            }}>
              <label style={{ fontWeight: '600', color: 'white' }}>Currency:</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                  color: 'white', 
                  border: '1px solid rgba(255, 255, 255, 0.3)', 
                  outline: 'none', 
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  minWidth: '80px'
                }}
              >
                <option value="KES" style={{ backgroundColor: '#1e3a8a', color: 'white' }}>KES</option>
                <option value="USD" style={{ backgroundColor: '#1e3a8a', color: 'white' }}>USD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <section className="mb-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '24px', 
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>Featured Products</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              justifyContent: 'center',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
                              {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    cartQuantity={getCartQuantity(product.id)}
                    formatPrice={formatPrice}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* Smart Stock Alerts */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px' }}>
            <h2 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '24px', 
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>Smart Stock Alerts</h2>
            <div style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)', 
              border: '2px solid #f59e0b', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#92400e', 
                marginBottom: '16px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>Low Stock Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredProducts.filter(p => p.stock < 10).map((product) => (
                  <div key={product.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    backgroundColor: 'white', 
                    padding: '12px', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontWeight: '500', color: '#374151' }}>{product.name}</span>
                    <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '14px' }}>Only {product.stock} left!</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Expiring Soon */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px' }}>
            <h2 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '24px', 
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>Expiring Soon</h2>
            <div style={{ 
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #f87171 100%)', 
              border: '2px solid #f87171', 
              borderRadius: '12px', 
              padding: '24px',
              boxShadow: '0 10px 25px rgba(248, 113, 113, 0.3)'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#991b1b', 
                marginBottom: '16px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>Items Expiring This Week</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredProducts.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).slice(0, 3).map((product) => (
                  <div key={product.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    backgroundColor: 'white', 
                    padding: '12px', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <span style={{ fontWeight: '500', color: '#374151' }}>{product.name}</span>
                    <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '14px' }}>Expires: {product.expiryDate}</span>
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
