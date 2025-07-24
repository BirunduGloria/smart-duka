'use client';

import { useContext, useEffect } from 'react';
import { UserContext } from '.././context/UserContext';
import InventoryList from '.././components/InventoryList';
import { useRouter } from 'next/navigation';
import '.././ashington-CSS/login.css'; 

export default function InventoryPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]); // ✅ This resolves the EOF error

  return (
    <div className="inventory-wrapper p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Dashboard</h2>
      <InventoryList />
    </div>
  );
}
