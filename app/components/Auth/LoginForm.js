'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../.././context/UserContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check against registered users first
      const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = registeredUsers.find(u => u.email === email && u.password === password);

      if (user) {
        // User found in registered users
        const userToSet = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        setUser(userToSet);
        localStorage.setItem('user', JSON.stringify(userToSet));
        router.push(user.role === 'admin' ? '/inventory' : '/');
        return;
      }

      // Fallback to hardcoded admin emails (for backward compatibility)
      const allowedAdminEmails = [
        'ashington.munene@student.moringaschool.com',
        'peter.munyambu@student.moringaschool.com',
        'gideon.kimaiyo@student.moringaschool.com',
        'gloria.birundu@student.moringaschool.com',
        'beatrice.wambui@moringaschool.com'
      ];

      const isAdmin = allowedAdminEmails.includes(email) && password === '1234';

      if (isAdmin) {
        const loggedInUser = {
          email,
          role: 'admin',
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };

        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        router.push('/inventory');
        return;
      }

      // No user found
      setError('Invalid email or password');
      
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          padding: '32px 24px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          borderRadius: '16px', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Smart Duka</h1>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280' }}>Welcome Back</h2>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              border: '1px solid #f87171', 
              color: '#991b1b', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                background: 'linear-gradient(to right, #2563eb, #1d4ed8)', 
                color: 'white', 
                fontWeight: '600', 
                padding: '14px 16px', 
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <a 
                href="/forgot-password" 
                style={{ 
                  color: '#2563eb', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                Forgot password?
              </a>
              <a 
                href="/signup" 
                style={{ 
                  color: '#2563eb', 
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
