import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ Room_No: '', Category: 'Single', Rent: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load rooms');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const save = async () => {
    if (!form.Room_No || !form.Rent) {
      showMessage('error', 'Please fill all fields');
      return;
    }

    try {
      await API.post('/rooms', form);
      await loadRooms();
      setForm({ Room_No: '', Category: 'Single', Rent: '' });
      showMessage('success', 'Room saved successfully');
    } catch (e) {
      showMessage('error', 'Error saving room');
    }
  };

  return (
    <div>
      <h2 className="page-title">Room Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter room number"
              value={form.Room_No}
              onChange={(e) => setForm({ ...form, Room_No: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              className="form-select"
              value={form.Category}
              onChange={(e) => setForm({ ...form, Category: e.target.value })}
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rent (per night) *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter rent amount"
              value={form.Rent}
              onChange={(e) => setForm({ ...form, Rent: e.target.value })}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={save}>
              Save Room
            </button>
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Room No</th>
            <th>Category</th>
            <th>Rent (per night)</th>
            <th>Status</th>
            <th>Last Cleaned</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.Room_No}>
              <td><strong>Room {r.Room_No}</strong></td>
              <td>{r.Category}</td>
              <td>₹{r.Rent}</td>
              <td>
                <span className={`status-badge status-${r.Status.toLowerCase()}`}>
                  {r.Status}
                </span>
              </td>
              <td>{r.Last_Cleaned ? new Date(r.Last_Cleaned).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
