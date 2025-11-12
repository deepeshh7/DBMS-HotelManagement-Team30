import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({
    Name: '',
    Contact_Info: '',
    Email: '',
    Nationality: 'India',
    Gender: 'Male'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const res = await API.get('/guests');
      setGuests(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load guests');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const add = async () => {
    if (!form.Name || !form.Email || !form.Contact_Info) {
      showMessage('error', 'Please fill all required fields');
      return;
    }

    try {
      await API.post('/guests', form);
      await loadGuests();
      setForm({ Name: '', Contact_Info: '', Email: '', Nationality: 'India', Gender: 'Male' });
      showMessage('success', 'Guest added successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to add guest');
    }
  };

  const deleteGuest = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?\n\nNote: This will also delete all their reservations and payment records.`
    );
    if (!confirmed) return;

    try {
      await API.delete(`/guests/${id}`);
      await loadGuests();
      showMessage('success', 'Guest deleted successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to delete guest');
    }
  };

  return (
    <div>
      <h2 className="page-title">Guest Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              className="form-input"
              placeholder="Enter guest name"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Contact Number *</label>
            <input
              className="form-input"
              placeholder="Enter contact number"
              value={form.Contact_Info}
              onChange={(e) => setForm({ ...form, Contact_Info: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter email"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Nationality</label>
            <input
              className="form-input"
              placeholder="Enter nationality"
              value={form.Nationality}
              onChange={(e) => setForm({ ...form, Nationality: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              className="form-select"
              value={form.Gender}
              onChange={(e) => setForm({ ...form, Gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={add}>
              Add Guest
            </button>
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Nationality</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.Guest_ID}>
              <td>#{g.Guest_ID}</td>
              <td>{g.Name}</td>
              <td>{g.Contact_Info}</td>
              <td>{g.Email}</td>
              <td>{g.Nationality}</td>
              <td>{g.Gender}</td>
              <td>
                <span className={`status-badge ${g.Check_In_Status ? 'status-occupied' : 'status-available'}`}>
                  {g.Check_In_Status ? 'Checked-in' : 'Not Checked-in'}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => deleteGuest(g.Guest_ID, g.Name)}
                  disabled={g.Check_In_Status}
                  title={g.Check_In_Status ? 'Cannot delete checked-in guest' : 'Delete guest'}
                  style={{ opacity: g.Check_In_Status ? 0.5 : 1 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

