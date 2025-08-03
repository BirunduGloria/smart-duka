'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../.././context/UserContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();

    const allowedAdminEmails = [
      'ashington.munene@student.moringaschool.com',
      'peter.munyambu@student.moringaschool.com',
      'gideon.kimaiyo@student.moringaschool.com',
      'gloria.birundu@student.moringaschool.com',
      'beatrice.wambui@moringaschool.com'
    ];

    const isAdmin = allowedAdminEmails.includes(email) && password === '1234';

    const loggedInUser = {
      email,
      role: isAdmin ? 'admin' : 'user',
    };

    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    router.push(isAdmin ? '/admin' : '/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Log In
            </button>

            <div className="flex justify-between text-sm">
              <a href="/forgot-password" className="text-blue-600 hover:text-blue-500">Forgot password?</a>
              <a href="/admin" className="text-blue-600 hover:text-blue-500">Admin</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
