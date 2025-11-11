import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ guestId: '', roomNo: '', checkIn: '', checkOut: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, guestsRes, roomsRes] = await Promise.all([
        API.get('/reservations'),
        API.get('/guests'),
        API.get('/rooms')
      ]);
      setReservations(reservationsRes.data);
      setGuests(guestsRes.data);
      setRooms(roomsRes.data.filter(r => r.Status === 'Available'));
    } catch (err) {
      showMessage('error', 'Failed to load data');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const create = async () => {
    if (!form.guestId || !form.roomNo || !form.checkIn || !form.checkOut) {
      showMessage('error', 'Please fill all fields');
      return;
    }

    try {
      await API.post('/reservations', {
        guestId: form.guestId,
        roomNo: form.roomNo,
        checkIn: form.checkIn,
        checkOut: form.checkOut
      });
      await loadData();
      setForm({ guestId: '', roomNo: '', checkIn: '', checkOut: '' });
      showMessage('success', 'Reservation created successfully');
    } catch (e) {
      showMessage('error', e.response?.data?.error || 'Failed to create reservation');
    }
  };

  const setStatus = async (id, status) => {
    try {
      await API.put(`/reservations/${id}/status`, { status });
      await loadData();
      showMessage('success', `Reservation ${status} successfully`);
    } catch (err) {
      showMessage('error', 'Failed to update status');
    }
  };

  return (
    <div>
      <h2 className="page-title">Reservation Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Guest *</label>
            <select
              className="form-select"
              value={form.guestId}
              onChange={(e) => setForm({ ...form, guestId: e.target.value })}
            >
              <option value="">Select Guest</option>
              {guests.map((g) => (
                <option key={g.Guest_ID} value={g.Guest_ID}>
                  {g.Name} ({g.Email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Room *</label>
            <select
              className="form-select"
              value={form.roomNo}
              onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r.Room_No} value={r.Room_No}>
                  Room {r.Room_No} - {r.Category} (₹{r.Rent}/night)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Check-in Date *</label>
            <input
              type="date"
              className="form-input"
              value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label>Check-out Date *</label>
            <input
              type="date"
              className="form-input"
              value={form.checkOut}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              min={form.checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={create}>
              Create Reservation
            </button>
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.Reservation_ID}>
              <td>#{r.Reservation_ID}</td>
              <td>{r.GuestName}</td>
              <td>Room {r.Room_No} ({r.RoomCategory})</td>
              <td>{new Date(r.Check_In_Date).toLocaleDateString()}</td>
              <td>{new Date(r.Check_Out_Date).toLocaleDateString()}</td>
              <td>₹{r.Total_Amount}</td>
              <td>
                <span className={`status-badge status-${r.Status.toLowerCase()}`}>
                  {r.Status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {r.Status === 'Confirmed' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setStatus(r.Reservation_ID, 'CheckedIn')}
                    >
                      Check In
                    </button>
                  )}
                  {r.Status === 'CheckedIn' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setStatus(r.Reservation_ID, 'CheckedOut')}
                    >
                      Check Out
                    </button>
                  )}
                  {(r.Status === 'Confirmed' || r.Status === 'CheckedIn') && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setStatus(r.Reservation_ID, 'Cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
