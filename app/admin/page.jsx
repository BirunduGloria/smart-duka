'use client';

export default function AdminLoginPage() {
  return (
    <div className="auth-wrapper">
      <h2 className="admin-heading">Welcome Admin</h2>
      <form className="admin-form">
        <input type="email" placeholder="Admin Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
        <div className="links">
          <a href="/">User</a>
        </div>
      </form>
    </div>
  );
}
