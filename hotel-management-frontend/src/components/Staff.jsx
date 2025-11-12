import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    Name: '',
    Dept: '',
    Age: '',
    Contact_Info: '',
    Salary: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await API.get('/staff');
      setStaff(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load staff');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const add = async () => {
    if (!form.Name || !form.Dept || !form.Age || !form.Contact_Info || !form.Salary) {
      showMessage('error', 'Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing staff
        await API.put(`/staff/${editingId}`, form);
        showMessage('success', 'Staff member updated successfully');
        setEditingId(null);
      } else {
        // Add new staff
        await API.post('/staff', {
          ...form,
          Join_Date: new Date().toISOString().split('T')[0]
        });
        showMessage('success', 'Staff member added successfully');
      }
      await loadStaff();
      setForm({ Name: '', Dept: '', Age: '', Contact_Info: '', Salary: '' });
    } catch (err) {
      showMessage('error', editingId ? 'Failed to update staff member' : 'Failed to add staff member');
    }
  };

  const editStaff = (s) => {
    setForm({
      Name: s.Name,
      Dept: s.Dept,
      Age: s.Age,
      Contact_Info: s.Contact_Info,
      Salary: s.Salary
    });
    setEditingId(s.Staff_ID);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setForm({ Name: '', Dept: '', Age: '', Contact_Info: '', Salary: '' });
    setEditingId(null);
  };

  const deleteStaff = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirmed) return;

    try {
      await API.delete(`/staff/${id}`);
      await loadStaff();
      showMessage('success', 'Staff member deleted successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to delete staff member');
    }
  };

  return (
    <div>
      <h2 className="page-title">Staff Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {editingId && (
        <div className="alert alert-info">
          Editing staff member. Update the details below and click "Update Staff".
        </div>
      )}

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Name *</label>
            <input
              className="form-input"
              placeholder="Enter staff name"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <select
              className="form-select"
              value={form.Dept}
              onChange={(e) => setForm({ ...form, Dept: e.target.value })}
            >
              <option value="">Select Department</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter age"
              value={form.Age}
              onChange={(e) => setForm({ ...form, Age: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Contact *</label>
            <input
              className="form-input"
              placeholder="Enter contact number"
              value={form.Contact_Info}
              onChange={(e) => setForm({ ...form, Contact_Info: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Salary *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter salary"
              value={form.Salary}
              onChange={(e) => setForm({ ...form, Salary: e.target.value })}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={add}>
              {editingId ? 'Update Staff' : 'Add Staff'}
            </button>
            {editingId && (
              <button 
                className="btn btn-secondary" 
                onClick={cancelEdit}
                style={{ marginLeft: '0.5rem' }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Age</th>
            <th>Contact</th>
            <th>Salary</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.Staff_ID}>
              <td>#{s.Staff_ID}</td>
              <td>{s.Name}</td>
              <td>{s.Dept}</td>
              <td>{s.Age}</td>
              <td>{s.Contact_Info}</td>
              <td>₹{s.Salary}</td>
              <td>{s.Join_Date ? new Date(s.Join_Date).toLocaleDateString() : 'N/A'}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => editStaff(s)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => deleteStaff(s.Staff_ID, s.Name)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
