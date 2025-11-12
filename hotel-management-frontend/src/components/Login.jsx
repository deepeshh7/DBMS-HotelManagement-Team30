import React, { useState } from 'react';

export default function Login({ onLogin, loginType, onBack }) {
  const isAdmin = loginType === 'admin';
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple demo authentication (in production, use real API)
    if (isAdmin) {
      if (form.email === 'admin@hotel.com' && form.password === 'admin123') {
        onLogin({ role: 'admin', name: 'Admin', email: form.email });
      } else {
        setError('Invalid admin credentials. Use admin@hotel.com / admin123');
      }
    } else {
      // Customer login - just needs email and name for demo
      if (form.email && form.name) {
        onLogin({ role: 'customer', name: form.name, email: form.email });
      } else {
        setError('Please enter your name and email');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        
        <img src="/caesars-logo.svg" alt="Caesars Palace" style={{height: '80px', marginBottom: '20px'}} />
        <h2>{isAdmin ? 'Admin Login' : 'Guest Booking'}</h2>
        <p className="auth-subtitle">
          {isAdmin ? 'Access the admin dashboard' : 'Enter your details to book a room'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isAdmin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your full name"
                required={!isAdmin}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          {isAdmin && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                required={isAdmin}
              />
            </div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary">
            {isAdmin ? 'Login to Dashboard' : 'Continue to Booking'}
          </button>
        </form>

        {isAdmin && (
          <div className="auth-link">
            <small>Demo credentials: admin@hotel.com / admin123</small>
          </div>
        )}
      </div>
    </div>
  );
}
