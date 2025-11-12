import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [roomServices, setRoomServices] = useState([]);
  const [form, setForm] = useState({ reservationId: '', amount: '', method: 'Cash' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsRes, reservationsRes, roomServicesRes] = await Promise.all([
        API.get('/payments'),
        API.get('/reservations'),
        API.get('/room-services')
      ]);
      setPayments(paymentsRes.data);
      setRoomServices(roomServicesRes.data);
      // Only show reservations that are checked in or confirmed
      setReservations(
        reservationsRes.data.filter(r => r.Status === 'Confirmed' || r.Status === 'CheckedIn')
      );
    } catch (err) {
      showMessage('error', 'Failed to load data');
    }
  };

  const getRoomServiceCharges = (roomNo, checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    return roomServices
      .filter(rs => {
        const serviceDate = new Date(rs.Service_Date);
        return rs.Room_No === roomNo && 
               serviceDate >= checkIn && 
               serviceDate <= checkOut;
      })
      .reduce((sum, rs) => sum + parseFloat(rs.Total_Charge), 0);
  };

  const getTotalBill = (reservation) => {
    const roomCharges = parseFloat(reservation.Total_Amount);
    const serviceCharges = getRoomServiceCharges(
      reservation.Room_No,
      reservation.Check_In_Date,
      reservation.Check_Out_Date
    );
    return roomCharges + serviceCharges;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const pay = async () => {
    if (!form.reservationId || !form.amount || parseFloat(form.amount) <= 0) {
      showMessage('error', 'Please fill all fields with valid values');
      return;
    }

    try {
      await API.post('/payments', {
        reservationId: form.reservationId,
        amount: parseFloat(form.amount),
        method: form.method
      });
      await loadData();
      setForm({ reservationId: '', amount: '', method: 'Cash' });
      showMessage('success', 'Payment recorded successfully');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Payment failed');
    }
  };

  const getTotalPaid = (reservationId) => {
    return payments
      .filter(p => p.Reservation_ID === reservationId)
      .reduce((sum, p) => sum + parseFloat(p.Amount), 0);
  };

  return (
    <div>
      <h2 className="page-title">Payment Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-container">
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Reservation *</label>
            <select
              className="form-select"
              value={form.reservationId}
              onChange={(e) => {
                const reservation = reservations.find(r => r.Reservation_ID === parseInt(e.target.value));
                if (reservation) {
                  const totalBill = getTotalBill(reservation);
                  const totalPaid = getTotalPaid(reservation.Reservation_ID);
                  const remaining = totalBill - totalPaid;
                  setForm({
                    ...form,
                    reservationId: e.target.value,
                    amount: remaining.toFixed(2)
                  });
                } else {
                  setForm({
                    ...form,
                    reservationId: e.target.value,
                    amount: ''
                  });
                }
              }}
            >
              <option value="">Select Reservation</option>
              {reservations.map((r) => {
                const totalBill = getTotalBill(r);
                const totalPaid = getTotalPaid(r.Reservation_ID);
                const remaining = totalBill - totalPaid;
                return (
                  <option key={r.Reservation_ID} value={r.Reservation_ID}>
                    #{r.Reservation_ID} - {r.GuestName} - Room {r.Room_No} (Total: ₹{totalBill.toFixed(2)}, Paid: ₹{totalPaid}, Due: ₹{remaining.toFixed(2)})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Payment Method *</label>
            <select
              className="form-select"
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Online">Online Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" onClick={pay}>
              Record Payment
            </button>
          </div>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Reservation ID</th>
            <th>Guest</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.Payment_ID}>
              <td>#{p.Payment_ID}</td>
              <td>#{p.Reservation_ID}</td>
              <td>{p.GuestName}</td>
              <td>₹{p.Amount}</td>
              <td>{p.Payment_Method}</td>
              <td>{new Date(p.Payment_Date).toLocaleString()}</td>
              <td>
                <span className="status-badge status-confirmed">
                  {p.Status || 'Completed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
