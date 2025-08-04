// app/context/ContextProvider.js
'use client';
import { UserProvider } from './UserContext';

export function ContextProvider({ children }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
