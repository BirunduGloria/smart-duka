'use client';

import { useEffect, useState } from "react";

export default function LayoutWrapper({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Avoid hydration mismatch

  return (
    <>
      {children}
    </>
  );
}