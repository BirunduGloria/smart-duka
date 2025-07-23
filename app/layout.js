'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { UserContext } from './context/UserContext'; 
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Smart POS System',
  description: 'A POS app built with Next.js',
};

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      </body>
    </html>
  );
}
