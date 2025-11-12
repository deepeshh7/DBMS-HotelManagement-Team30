import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Rooms from './Rooms';
import Guests from './Guests';
import Staff from './Staff';
import Reservations from './Reservations';
import Payments from './Payments';
import Services from './Services';

export default function AdminDashboard({ user, onLogout }) {
  const [view, setView] = useState('dashboard');

  return (
    <div>
      <header className="app-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <img src="/caesars-logo.svg" alt="Caesars Palace" style={{height: '50px'}} />
          <h1>Caesars Palace - Admin</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Admin: {user.name}</span>
          <nav>
            {['dashboard', 'rooms', 'guests', 'staff', 'reservations', 'payments', 'services'].map((v) => (
              <button
                key={v}
                className={`nav-btn ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
            <button className="nav-btn" onClick={onLogout}>
              logout
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="content-card">
          {view === 'dashboard' && <Dashboard />}
          {view === 'rooms' && <Rooms />}
          {view === 'guests' && <Guests />}
          {view === 'staff' && <Staff />}
          {view === 'reservations' && <Reservations />}
          {view === 'payments' && <Payments />}
          {view === 'services' && <Services />}
        </div>
      </main>
    </div>
  );
}
