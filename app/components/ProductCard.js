'use client';
import React, { useEffect, useState } from 'react';
import styles from './ProductCard.module.css';
import ProductForm from './ProductForm';
import { useRouter } from 'next/navigation';

export default function ProductCard({
  product,
  isAdmin,
  onAddToCart,
  onEdit,
  onDelete,
}) {

  return (
    <div className={styles.card}>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
        <h3 className={styles.title}>{product.name}</h3>
        {product.pricing?.discount > 0 && (
          <span className={`${styles.badge} ${styles.badgePink}`}>On Offer</span>
        )}
        {product.inventory?.unitsSold > 50 && (
          <span className={`${styles.badge} ${styles.badgeRed}`}>Selling Fast</span>
        )}
      </div>
      <p className={styles.text}>Category: {product.category}</p>
      <p className={styles.text}>Price: ${product.pricing?.price?.toFixed(2) ?? 'N/A'}</p>
      <p className={styles.text}>Stock: {product.inventory?.unitsInStock ?? 'N/A'}</p>
      <div className={styles.badgeContainer}>
        {product.inventory?.unitsInStock <= 2 && (
          <span className={`${styles.badge} ${styles.badgeYellow}`}>Only 2 Left!</span>
        )}
        {product.inventory?.unitsInStock < 15 && product.inventory?.unitsInStock > 2 && (
          <span className={`${styles.badge} ${styles.badgeOrange}`}>Expiring Soon</span>
        )}
      </div>
      {/* Add button and admin controls as needed, using styles.button, styles.adminButtons, etc. */}
    </div>
  );
}