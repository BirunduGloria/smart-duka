import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">🛒 Smart Duka</h3>
          <p className="text-gray-300">Your one-stop shop for everything you need</p>
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">
            About Us
          </a>
          <a href="#" className="footer-link">
            Contact
          </a>
          <a href="#" className="footer-link">
            Privacy Policy
          </a>
          <a href="#" className="footer-link">
            Terms of Service
          </a>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Smart Duka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 