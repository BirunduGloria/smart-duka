'use client';

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('KES');

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      console.log('Cart page - Loading cart from localStorage:', savedCart);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log('Cart page - Parsed cart:', parsedCart);
          setCart(parsedCart);
        } catch (error) {
          console.error('Cart page - Error parsing cart:', error);
          setCart([]);
        }
      } else {
        console.log('Cart page - No cart data in localStorage');
        setCart([]);
      }
    };

    // Load cart initially
    loadCart();

    // Listen for storage changes (when cart is updated from other pages)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        console.log('Cart page - Storage change detected:', e.newValue);
        loadCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom cart update events
    const handleCartUpdate = () => {
      console.log('Cart page - Custom cart update event received');
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Additional effect to periodically check for cart updates
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCart = localStorage.getItem('cart');
      console.log('Cart page - Periodic check, savedCart:', savedCart);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log('Cart page - Periodic check, parsedCart:', parsedCart);
          if (JSON.stringify(parsedCart) !== JSON.stringify(cart)) {
            console.log('Cart page - Cart data changed, updating...');
            setCart(parsedCart);
          }
        } catch (error) {
          console.error('Cart page - Error in periodic check:', error);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [cart]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const formatPrice = (price) => {
    const exchangeRate = currency === 'USD' ? 0.007 : 1;
    const convertedPrice = price * exchangeRate;
    const symbol = currency === 'USD' ? '$' : 'KSh';
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <>
        <NavBar cartCount={cartCount} />
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Your cart is empty</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Add some products to get started!</p>
            <a 
              href="/"
              style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.3s ease'
              }}
            >
              Continue Shopping
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar cartCount={cartCount} />
      
      <main style={{ flex: 1, paddingTop: '32px', paddingBottom: '32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>Shopping Cart</h1>
            <button 
              onClick={() => {
                const savedCart = localStorage.getItem('cart');
                console.log('Manual refresh - cart data:', savedCart);
                if (savedCart) {
                  setCart(JSON.parse(savedCart));
                }
              }}
              style={{ 
                backgroundColor: '#2563eb', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Refresh Cart
            </button>
          </div>
          
          {/* Currency Selector */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <label style={{ fontWeight: '500', color: '#374151' }}>Currency:</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', color: '#374151' }}
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Cart Items */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>Cart Items ({cart.length})</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    padding: '16px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    alignItems: 'center'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{item.name}</h3>
                      <p style={{ color: '#6b7280', marginBottom: '8px' }}>{item.category}</p>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{formatPrice(item.price)}</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          backgroundColor: '#f3f4f6', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          backgroundColor: item.quantity >= item.stock ? '#d1d5db' : '#f3f4f6', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ 
                          backgroundColor: '#ef4444', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', height: 'fit-content' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Subtotal ({cartCount} items):</span>
                  <span style={{ fontWeight: '600' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Shipping:</span>
                  <span style={{ fontWeight: '600' }}>Free</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Total:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <button
                style={{ 
                  width: '100%', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => setCart([])}
                style={{ 
                  width: '100%', 
                  backgroundColor: 'transparent', 
                  color: '#6b7280', 
                  padding: '8px 16px', 
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
} 