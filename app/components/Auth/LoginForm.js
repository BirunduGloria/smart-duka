import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();

    const loggedInUser = { email, role: isAdmin ? 'admin' : 'user' };
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    router.push('/dashboard'); 
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-72">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Log In
      </button>

      <div className="flex flex-col items-start text-sm mt-2">
        <a
          href="/forgot-password"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Forgot Password?
        </a>

        <a
          href="/admin"
          className="text-blue-600 underline hover:text-blue-800 mt-1"
        >
          Admin
        </a>
      </div>
    </form>
  );
}

export default LoginForm;
