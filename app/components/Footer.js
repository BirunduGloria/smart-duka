import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'linear-gradient(to right, #1f2937, #1e3a8a)', 
      color: 'white', 
      padding: '32px 0',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '16px' }}>
          <Link href="/about" style={{ 
            color: '#d1d5db', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            About Us
          </Link>
          <Link href="/contact" style={{ 
            color: '#d1d5db', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            Contact
          </Link>
          <Link href="/privacy" style={{ 
            color: '#d1d5db', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ 
            color: '#d1d5db', 
            textDecoration: 'none',
            transition: 'color 0.3s ease'
          }}>
            Terms of Service
          </Link>
        </div>
        <p style={{ color: '#9ca3af' }}>
          © 2024 Smart Duka. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 