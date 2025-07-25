import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import '../../ashington-CSS/Login.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isLogin ? '' : 'slide-left'}`}>
        <div className="form-panel login-panel">
          <LoginForm />
        </div>
        <div></div>
      </div>

      <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </div>
  );
}

export default LoginPage;
