'use client';

import { useContext, useEffect } from 'react';
//import { UserContext } from '../../context/UserContext';
import InventoryList from '../components/InventoryList';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/UserContext';

function InventoryPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  {/*useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, []);*/}

  return (
    <div className="inventory-wrapper">
      <h2>Inventory List</h2>
      <InventoryList />
    </div>
  );
}

export default InventoryPage;
