import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsRes, guestsRes, reservationsRes, paymentsRes] = await Promise.all([
        API.get('/rooms').catch(() => ({ data: [] })),
        API.get('/guests').catch(() => ({ data: [] })),
        API.get('/reservations').catch(() => ({ data: [] })),
        API.get('/payments').catch(() => ({ data: [] }))
      ]);
      setRooms(roomsRes.data);
      setGuests(guestsRes.data);
      setReservations(reservationsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.Amount || 0), 0);
  const availableRooms = rooms.filter(r => r.Status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.Status === 'Occupied').length;
  const checkedInGuests = guests.filter(g => g.Check_In_Status === 1 || g.Check_In_Status === true).length;
  const activeReservations = reservations.filter(r => r.Status === 'Confirmed' || r.Status === 'CheckedIn').length;

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="page-title">Dashboard Overview</h2>

      <div className="dashboard-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Total Rooms</h3>
          <div className="stat-value">{rooms.length}</div>
          <div className="stat-label">Available: {availableRooms} | Occupied: {occupiedRooms}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Total Guests</h3>
          <div className="stat-value">{guests.length}</div>
          <div className="stat-label">Checked-in: {checkedInGuests}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Reservations</h3>
          <div className="stat-value">{reservations.length}</div>
          <div className="stat-label">Active: {activeReservations}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Total Revenue</h3>
          <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
          <div className="stat-label">{payments.length} payments</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Reservations</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reservations.slice(0, 5).map(r => (
              <tr key={r.Reservation_ID}>
                <td>#{r.Reservation_ID}</td>
                <td>{r.GuestName}</td>
                <td>Room {r.Room_No}</td>
                <td>{new Date(r.Check_In_Date).toLocaleDateString()}</td>
                <td>{new Date(r.Check_Out_Date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${r.Status.toLowerCase()}`}>
                    {r.Status}
                  </span>
                </td>
                <td>₹{r.Total_Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

