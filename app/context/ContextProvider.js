// app/context/ContextProvider.js
'use client';
import { useState } from 'react';
import { UserContext } from './UserContext';

export function ContextProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
