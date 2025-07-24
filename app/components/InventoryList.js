'use client';

import React from 'react';
import inventoryData from '../../data/products.json';

export default function InventoryList() {
  return (
    <div className="inventory-wrapper">
      <h2> Inventory Overview</h2>
      <ul className="inventory-list">
        {inventoryData.map((product) => {
          const {
            id,
            name,
            category,
            pricing,
            inventory,
            expiryDate,
          } = product;

          const discountedPrice = pricing.price - pricing.discount;
          const isLowStock = inventory.unitsInStock <= 5;
          const isExpired =
            expiryDate && new Date(expiryDate) < new Date();

          return (
            <li key={id} className="inventory-item">
              <strong>{name}</strong> — {category}
              <br />
              Price: Ksh {pricing.price.toFixed(2)}{' '}
              {pricing.discount > 0 && (
                <span className="discount">
                  (Discount: -{pricing.discount.toFixed(2)}, New: Ksh{' '}
                  {discountedPrice.toFixed(2)})
                </span>
              )}
              <br />
              Stock:{" "}
              <span className={isLowStock ? 'low-stock' : ''}>
                {inventory.unitsInStock}
              </span>{' '}
              | Sold: {inventory.unitsSold}
              {expiryDate && (
                <>
                  <br />
                  Expiry:{" "}
                  <span className={isExpired ? 'expired' : ''}>
                    {expiryDate}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
