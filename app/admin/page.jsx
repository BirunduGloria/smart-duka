'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/UserContext';
import NavBar from '.././components/NavBar';


export default function AdminPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'admin') {
          setIsChecking(false);
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    } else if (user.role !== 'admin') {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  if (isChecking) return <p className="text-center mt-20">Checking access...</p>;

  return (
    <div className="p-6">
      <NavBar />
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome back, {user?.email} </p>
    </div>
  );
}
