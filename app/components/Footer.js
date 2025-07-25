import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-6 mt-8 text-center">
      <div className="container mx-auto">
        <p className="mb-2">&copy; {new Date().getFullYear()} Smart Duka. All rights reserved.</p>
        <p className="text-sm">Made with <span style={{color: '#f97316'}}>❤</span> by your team.</p>
      </div>
    </footer>
  );
} 