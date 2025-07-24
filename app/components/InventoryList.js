'use client';

import inventoryData from '../../data/products.json';

export default function InventoryList() {
  return (
    <ul className="inventory-list">
      {inventoryData.map((product) => {
        const { id, name, category, pricing, inventory, expiryDate } = product;
        const discountedPrice = pricing.price - pricing.discount;
        const isLowStock = inventory.unitsInStock <= 5;

        return (
          <li key={id} className="inventory-item">
            <strong>{name}</strong> — {category}<br />
            Price: Ksh {pricing.price.toFixed(2)}
            {pricing.discount > 0 && (
              <span> (Discount: Ksh {pricing.discount.toFixed(2)} → {discountedPrice.toFixed(2)})</span>
            )}<br />
            Stock: <span className={isLowStock ? 'low-stock' : ''}>{inventory.unitsInStock}</span> | Sold: {inventory.unitsSold}<br />
            Expiry: {expiryDate}
          </li>
        );
      })}
    </ul>
  );
}
