import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [roomServices, setRoomServices] = useState([]);
  const [form, setForm] = useState({ Service_Name: '', Description: '', Charges: '' });
  const [assignForm, setAssignForm] = useState({ reservationId: '', serviceId: '', quantity: 1 });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAssignForm, setShowAssignForm] = useState(false);

  useEffect(() => {
    loadServices();
    loadActiveReservations();
    loadRoomServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await API.get('/services');
      setServices(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load services');
    }
  };

  const loadActiveReservations = async () => {
    try {
      const res = await API.get('/reservations');
      // Only show reservations that are currently checked in
      setActiveReservations(res.data.filter(r => r.Status === 'CheckedIn'));
    } catch (err) {
      console.error('Failed to load reservations');
    }
  };

  const loadRoomServices = async () => {
    try {
      const res = await API.get('/room-services');
      setRoomServices(res.data);
    } catch (err) {
      console.error('Failed to load room services');
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

  const assignService = async () => {
    if (!assignForm.reservationId || !assignForm.serviceId || !assignForm.quantity) {
      showMessage('error', 'Please fill all fields');
      return;
    }

    try {
      const service = services.find(s => s.Service_ID === parseInt(assignForm.serviceId));
      const reservation = activeReservations.find(r => r.Reservation_ID === parseInt(assignForm.reservationId));
      
      if (!service || !reservation) {
        showMessage('error', 'Service or reservation not found');
        return;
      }

      const totalCharge = service.Charges * parseInt(assignForm.quantity);

      await API.post('/room-services', {
        roomNo: parseInt(reservation.Room_No),
        serviceId: parseInt(assignForm.serviceId),
        quantity: parseInt(assignForm.quantity),
        totalCharge: totalCharge,
        reservationId: parseInt(assignForm.reservationId)
      });

      await loadRoomServices();
      setAssignForm({ reservationId: '', serviceId: '', quantity: 1 });
      setShowAssignForm(false);
      showMessage('success', `Service assigned to ${reservation.GuestName} successfully`);
    } catch (err) {
      console.error('Assignment error:', err);
      showMessage('error', err.response?.data?.error || err.message || 'Failed to assign service');
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

      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-success" 
          onClick={() => setShowAssignForm(!showAssignForm)}
        >
          {showAssignForm ? 'Cancel' : '+ Assign Service to Room'}
        </button>
      </div>

      {showAssignForm && (
        <div className="form-container" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Assign Service to Guest</h3>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Guest / Room *</label>
              <select
                className="form-select"
                value={assignForm.reservationId}
                onChange={(e) => setAssignForm({ ...assignForm, reservationId: e.target.value })}
              >
                <option value="">Select Guest</option>
                {activeReservations.map(r => (
                  <option key={r.Reservation_ID} value={r.Reservation_ID}>
                    {r.GuestName} - Room {r.Room_No} (Checked In: {new Date(r.Check_In_Date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Service *</label>
              <select
                className="form-select"
                value={assignForm.serviceId}
                onChange={(e) => setAssignForm({ ...assignForm, serviceId: e.target.value })}
              >
                <option value="">Select Service</option>
                {services.map(s => (
                  <option key={s.Service_ID} value={s.Service_ID}>
                    {s.Service_Name} - ₹{s.Charges}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={assignForm.quantity}
                onChange={(e) => setAssignForm({ ...assignForm, quantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary" onClick={assignService}>
                Assign Service
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: '1rem' }}>Available Services</h3>
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

      {roomServices.length > 0 && (
        <>
          <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Assigned Services</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room No</th>
                <th>Service</th>
                <th>Quantity</th>
                <th>Total Charge</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {roomServices.map((rs) => (
                <tr key={rs.Room_Service_ID}>
                  <td>{rs.GuestName || 'N/A'}</td>
                  <td>Room {rs.Room_No}</td>
                  <td>{rs.Service_Name}</td>
                  <td>{rs.Quantity}</td>
                  <td>₹{rs.Total_Charge}</td>
                  <td>{new Date(rs.Service_Date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
