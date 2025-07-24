import { useState, useContext } from 'react';
{/*import { useRouter } from 'next/router';*/}
import { useRouter } from 'next/navigation'; 
import { UserContext } from '../../context/UserContext';

function SignupForm() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const handleSignup = (e) => {
    e.preventDefault();

    const newUser = { username, role };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    router.push(role === 'admin' ? '/inventory' : '/dashboard');
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 w-72">
      <input
        type="text"
        placeholder="Choose a Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" className="bg-green-600 text-white py-2 rounded">
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;