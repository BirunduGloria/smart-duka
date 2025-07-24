'use client';
import React from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  isAdmin,
  onAddToCart,
  onEdit,
  onDelete,
}) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{product.name}</h3>
      <p className={styles.text}>Category: {product.category}</p>
      <p className={styles.text}>Price: ${product.price.toFixed(2)}</p>
      <p className={styles.text}>Stock: {product.stock}</p>

      <div className={styles.badgeContainer}>
        {product.stock <= 2 && (
          <span className={`${styles.badge} ${styles.badgeYellow}`}>
            Only 2 Left!
          </span>
        )}
        {product.stock < 15 && product.stock > 2 && (
          <span className={`${styles.badge} ${styles.badgeOrange}`}>
            Expiring Soon
          </span>
        )}
        {product.discount > 0 && (
          <span className={`${styles.badge} ${styles.badgePink}`}>
            On Offer
          </span>
        )}
        {product.unitsSold > 50 && (
          <span className={`${styles.badge} ${styles.badgeRed}`}>
            Selling Fast
          </span>
        )}
      </div>

      <button
        onClick={() => onAddToCart(product)}
        className={styles.button}
      >
        Add to Cart
      </button>

      {isAdmin && (
        <div className={styles.adminButtons}>
          <button
            onClick={() => onEdit(product)}
            className={styles.editBtn}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className={styles.deleteBtn}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
