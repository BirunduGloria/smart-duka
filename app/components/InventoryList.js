'use client';

import inventoryData from '../data/products.json';
import { useUserContext } from '../context/UserContext';

export default function InventoryList() {
  const { user } = useUserContext();

  if (!user || user.role !== 'admin') {
    return null;
  }
  console.log(inventoryData);

  return (
    <ul className="inventory-list mt-6 px-4">
      {inventoryData.map(({ id, name, category, pricing, inventory, expiryDate }) => {
        const discountedPrice = pricing.price - pricing.discount;
        const isLowStock = inventory.unitsInStock <= 5;

        return (
          <li key={id} className="border-b py-4">
            <strong>{name}</strong> — {category}<br />
            Price: Ksh {pricing.price.toFixed(2)}
            {pricing.discount > 0 && (
              <span>
                {' '} (Discount: Ksh {pricing.discount.toFixed(2)} → Ksh {discountedPrice.toFixed(2)})
              </span>
            )}
            <br />
            Stock:{' '}
            <span className={isLowStock ? 'text-red-500 font-semibold' : ''}>
              {inventory.unitsInStock}
            </span>{' '}
            | Sold: {inventory.unitsSold}<br />
            Expiry: {expiryDate}
          </li>
        );
      })}
    </ul>
  );
}
