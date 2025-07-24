'use client';

import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import inventoryData from '../../data/products.json';

export default function InventoryPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, []);

  return (
    <div className="inventory-wrapper">
      <h2>Inventory List</h2>
      <ul className="inventory-list">
        {inventoryData.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> — {item.category}, Ksh {item.pricing.price}
            | Stock: {item.inventory.unitsInStock}
            | Sold: {item.inventory.unitsSold}
            {item.expiryDate && <> | Expiry: {item.expiryDate}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}
