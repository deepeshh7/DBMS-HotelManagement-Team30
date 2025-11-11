import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ Service_Name: '', Description: '', Charges: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await API.get('/services');
      setServices(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load services');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const add = async () => {
    if (!form.Service_Name || !form.Charges) {
      showMessage('error', 'Please fill required fields');
      return;
    }

    try {
      await API.post('/services', form);
      await loadServices();
      setForm({ Service_Name: '', Description: '', Charges: '' });
      showMessage('success', 'Service added successfully');
    } catch (err) {
      showMessage('error', 'Failed to add service');
    }
  };

  return (
    <div>
      <h2 className="page-title">Services Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Service Name *</label>
            <input
              className="form-input"
              placeholder="Enter service name"
              value={form.Service_Name}
              onChange={(e) => setForm({ ...form, Service_Name: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label>Description</label>
            <input
              className="form-input"
              placeholder="Enter service description"
              value={form.Description}
              onChange={(e) => setForm({ ...form, Description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Charges *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter charges"
              value={form.Charges}
              onChange={(e) => setForm({ ...form, Charges: e.target.value })}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={add}>
              Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="room-grid">
        {services.map((service) => (
          <div key={service.Service_ID} className="room-card">
            <div className="room-card-header">
              <div className="room-number" style={{ fontSize: '1.2rem' }}>
                {service.Service_Name}
              </div>
              <span className="status-badge status-available">Active</span>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem', minHeight: '3rem' }}>
              {service.Description || 'No description available'}
            </p>
            <div className="room-price">₹{service.Charges}</div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          No services available. Add your first service above.
        </div>
      )}
    </div>
  );
}
