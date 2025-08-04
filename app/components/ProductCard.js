'use client';
import React from 'react';

export default function ProductCard({ product, onAddToCart, onRemoveFromCart, onUpdateQuantity, cartQuantity = 0, formatPrice }) {
  const getStockStatus = (stock) => {
    if (stock > 20) return { color: '#10b981', text: 'In Stock' };
    if (stock > 10) return { color: '#f59e0b', text: 'Low Stock' };
    if (stock > 5) return { color: '#f97316', text: 'Very Low' };
    if (stock > 0) return { color: '#ec4899', text: 'Almost Gone' };
    return { color: '#ef4444', text: 'Out of Stock' };
  };

  const stockStatus = getStockStatus(product.stock);

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    margin: '8px',
    width: '280px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  };

  const imageContainerStyle = {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '12px',
    position: 'relative'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: stockStatus.color,
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const discountBadgeStyle = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  const categoryStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  };

  const priceStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: '8px'
  };

  const stockStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: 'auto'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto'
  };

  const removeButtonStyle = {
    flex: 1,
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const addMoreButtonStyle = {
    flex: 1,
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <img 
          src={product.image} 
          alt={product.name}
          style={imageStyle}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/280x180/f3f4f6/6b7280?text=No+Image';
          }}
        />
        
        <div style={badgeStyle}>
          {stockStatus.text}
        </div>

        {product.discount > 0 && (
          <div style={discountBadgeStyle}>
            {Math.round(product.discount * 100)}% OFF
          </div>
        )}
      </div>

      <h3 style={titleStyle}>{product.name}</h3>
      <p style={categoryStyle}>Category: {product.category}</p>
      <p style={priceStyle}>Price: {formatPrice ? formatPrice(product.price) : `$${product.price.toFixed(2)}`}</p>
      <p style={stockStyle}>Stock: {product.stock}</p>
      
      {cartQuantity === 0 ? (
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          style={{
            ...buttonStyle,
            backgroundColor: product.stock === 0 ? '#9ca3af' : '#2563eb'
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      ) : (
        <div style={buttonContainerStyle}>
          <button
            onClick={() => onRemoveFromCart(product.id)}
            style={removeButtonStyle}
          >
            Remove
          </button>
          <button
            onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
            disabled={product.stock <= cartQuantity}
            style={{
              ...addMoreButtonStyle,
              backgroundColor: product.stock <= cartQuantity ? '#9ca3af' : '#10b981'
            }}
          >
            Add More
          </button>
        </div>
      )}
    </div>
  );
}