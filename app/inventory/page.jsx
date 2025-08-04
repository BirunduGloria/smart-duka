'use client';

import { useContext, useEffect } from 'react';
import { UserContext } from '.././context/UserContext';
import InventoryList from '.././components/InventoryList';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]); // ✅ This resolves the EOF error

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Inventory Dashboard</h2>
      <InventoryList />
    </div>
  );
}
