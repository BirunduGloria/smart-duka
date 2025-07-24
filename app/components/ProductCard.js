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
  const price = product.pricing?.price || 0;
  const discount = product.pricing?.discount || 0;
  const stock = product.inventory?.unitsInStock || 0;
  const unitsSold = product.inventory?.unitsSold || 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{product.name}</h3>
      <p className={styles.text}>Category: {product.category}</p>
      <p className={styles.text}>Price: ${price.toFixed(2)}</p>
      <p className={styles.text}>Stock: {stock}</p>

      <div className={styles.badgeContainer}>
        {stock <= 2 && (
          <span className={`${styles.badge} ${styles.badgeYellow}`}>
            Only 2 Left!
          </span>
        )}
        {stock < 15 && stock > 2 && (
          <span className={`${styles.badge} ${styles.badgeOrange}`}>
            Expiring Soon
          </span>
        )}
        {discount > 0 && (
          <span className={`${styles.badge} ${styles.badgePink}`}>
            On Offer
          </span>
        )}
        {unitsSold > 50 && (
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
