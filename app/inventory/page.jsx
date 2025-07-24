'use client';

import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import InventoryList from '../../components/InventoryList';

function InventoryPage() {
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
      <InventoryList />
    </div>
  );
}

export default InventoryPage;
