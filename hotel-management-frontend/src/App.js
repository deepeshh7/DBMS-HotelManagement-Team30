import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import CustomerPortal from './components/CustomerPortal';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'customer' | 'admin'
  const [loginType, setLoginType] = useState('customer'); // 'customer' | 'admin'

  const handleShowLogin = (type) => {
    setLoginType(type);
    setView('login');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView(userData.role === 'admin' ? 'admin' : 'customer');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  return (
    <div className="App">
      {view === 'landing' && <LandingPage onShowLogin={handleShowLogin} />}
      {view === 'login' && (
        <Login
          onLogin={handleLogin}
          loginType={loginType}
          onBack={handleBackToLanding}
        />
      )}
      {view === 'customer' && <CustomerPortal user={user} onLogout={handleLogout} />}
      {view === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
