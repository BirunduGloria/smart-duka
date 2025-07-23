'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import '../../ashington-CSS/Login.css';

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
        'beatrice.wambui@moringaschool.com',
        ];

    const isAdmin = allowedAdminEmails.includes(email) && password === '1234';
;
    const loggedInUser = {
      email,
      role: isAdmin ? 'admin' : 'user',
    };

    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    router.push(isAdmin ? '/inventory' : '/dashboard');
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Log In</button>

      <div className="links">
        <a href="/forgot-password">Forgot password?</a>
        <a href="/admin">Admin</a>
      </div>
    </form>
  );
}

export default LoginForm;
