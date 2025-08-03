import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="mt-4 w-full text-center text-blue-600 hover:text-blue-500"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
