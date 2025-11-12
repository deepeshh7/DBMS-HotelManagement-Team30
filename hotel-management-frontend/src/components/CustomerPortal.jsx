import React, { useState, useEffect } from 'react';
import API from '../api';

export default function CustomerPortal({ user, onLogout }) {
  const [view, setView] = useState('browse'); // 'browse' | 'mybookings'
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [roomServices, setRoomServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ category: '', minPrice: '', maxPrice: '', checkIn: '', checkOut: '' });
  const [bookingForm, setBookingForm] = useState({ roomNo: null, checkIn: '', checkOut: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadRooms();
    loadMyBookings();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      showMessage('error', 'Failed to load rooms');
    }
    setLoading(false);
  };

  const loadMyBookings = async () => {
    try {
      const [reservationsRes, guestsRes, roomServicesRes] = await Promise.all([
        API.get('/reservations'),
        API.get('/guests'),
        API.get('/room-services')
      ]);
      
      setRoomServices(roomServicesRes.data);
      
      // Find current user's guest ID
      const currentGuest = guestsRes.data.find(g => g.Email === user.email);
      if (currentGuest) {
        // Filter bookings by guest ID
        const userBookings = reservationsRes.data.filter(b => b.Guest_ID === currentGuest.Guest_ID);
        setMyBookings(userBookings);
      }
    } catch (err) {
      console.error('Failed to load bookings');
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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const filteredRooms = rooms.filter(room => {
    if (filter.category && room.Category !== filter.category) return false;
    if (filter.minPrice && room.Rent < parseFloat(filter.minPrice)) return false;
    if (filter.maxPrice && room.Rent > parseFloat(filter.maxPrice)) return false;
    if (room.Status !== 'Available') return false;
    return true;
  });

  const handleBookRoom = async (roomNo) => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) {
      showMessage('error', 'Please select check-in and check-out dates');
      return;
    }

    try {
      // First, create guest if not exists
      const guestRes = await API.post('/guests', {
        Name: user.name,
        Contact_Info: '0000000000',
        Email: user.email,
        Nationality: 'India',
        Gender: 'Other'
      }).catch(() => null); // Guest might already exist

      // Get guest ID
      const guestsRes = await API.get('/guests');
      const guest = guestsRes.data.find(g => g.Email === user.email);

      if (!guest) {
        showMessage('error', 'Failed to create guest profile');
        return;
      }

      // Create reservation
      const reservationRes = await API.post('/reservations', {
        guestId: guest.Guest_ID,
        roomNo: roomNo,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut
      });

      showMessage('success', 'Room booked successfully!');
      setBookingForm({ roomNo: null, checkIn: '', checkOut: '' });
      loadRooms();
      loadMyBookings();
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Booking failed');
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <header className="app-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <img src="/caesars-logo.svg" alt="Caesars Palace" style={{height: '50px'}} />
          <h1>Caesars Palace</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user.name}</span>
          <nav>
            <button
              className={`nav-btn ${view === 'browse' ? 'active' : ''}`}
              onClick={() => setView('browse')}
            >
              Browse Rooms
            </button>
            <button
              className={`nav-btn ${view === 'mybookings' ? 'active' : ''}`}
              onClick={() => setView('mybookings')}
            >
              My Bookings
            </button>
            <button className="nav-btn" onClick={onLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {view === 'browse' && (
          <div className="content-card">
            <h2 className="page-title">Available Rooms</h2>

            {/* Filters */}
            <div className="form-container">
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-select"
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Min Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={filter.minPrice}
                    onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                    placeholder="Min"
                  />
                </div>
                <div className="form-group">
                  <label>Max Price</label>
                  <input
                    type="number"
                    className="form-input"
                    value={filter.maxPrice}
                    onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                    placeholder="Max"
                  />
                </div>
                <div className="form-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingForm.checkIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    className="form-input"
                    value={bookingForm.checkOut}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                    min={bookingForm.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            {!bookingForm.checkIn || !bookingForm.checkOut ? (
              <div className="alert alert-info">
                📅 Please select your check-in and check-out dates above to enable booking
              </div>
            ) : null}

            {loading ? (
              <div className="loading">Loading rooms...</div>
            ) : (
              <div className="room-grid">
                {filteredRooms.map((room) => {
                  const nights = calculateNights(bookingForm.checkIn, bookingForm.checkOut);
                  const totalPrice = nights * room.Rent;

                  return (
                    <div key={room.Room_No} className="room-card">
                      <div className="room-card-header">
                        <div className="room-number">Room {room.Room_No}</div>
                        <span className="status-badge status-available">{room.Status}</span>
                      </div>
                      <div className="room-category">{room.Category} Room</div>
                      <div className="room-price">₹{room.Rent} / night</div>
                      {nights > 0 && (
                        <div style={{ marginBottom: '1rem', color: '#666' }}>
                          {nights} night{nights > 1 ? 's' : ''} = ₹{totalPrice}
                        </div>
                      )}
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', opacity: (!bookingForm.checkIn || !bookingForm.checkOut) ? 0.5 : 1 }}
                        onClick={() => handleBookRoom(room.Room_No)}
                        disabled={!bookingForm.checkIn || !bookingForm.checkOut}
                        title={(!bookingForm.checkIn || !bookingForm.checkOut) ? 'Please select check-in and check-out dates first' : 'Click to book this room'}
                      >
                        {(!bookingForm.checkIn || !bookingForm.checkOut) ? 'Select Dates First' : 'Book Now'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filteredRooms.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                No rooms available matching your criteria
              </div>
            )}
          </div>
        )}

        {view === 'mybookings' && (
          <div className="content-card">
            <h2 className="page-title">My Bookings</h2>

            {myBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                You don't have any bookings yet
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Room</th>
                    <th>Category</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Room Charges</th>
                    <th>Service Charges</th>
                    <th>Total Bill</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((booking) => {
                    const serviceCharges = getRoomServiceCharges(booking.Room_No, booking.Check_In_Date, booking.Check_Out_Date);
                    const totalBill = parseFloat(booking.Total_Amount) + serviceCharges;
                    return (
                    <tr key={booking.Reservation_ID}>
                      <td>#{booking.Reservation_ID}</td>
                      <td>Room {booking.Room_No}</td>
                      <td>{booking.RoomCategory}</td>
                      <td>{new Date(booking.Check_In_Date).toLocaleDateString()}</td>
                      <td>{new Date(booking.Check_Out_Date).toLocaleDateString()}</td>
                      <td>₹{booking.Total_Amount}</td>
                      <td style={{ color: serviceCharges > 0 ? '#B8860B' : '#666' }}>
                        ₹{serviceCharges.toFixed(2)}
                      </td>
                      <td style={{ fontWeight: 'bold', color: '#B8860B' }}>
                        ₹{totalBill.toFixed(2)}
                      </td>
                      <td>
                        <span className={`status-badge status-${booking.Status.toLowerCase()}`}>
                          {booking.Status}
                        </span>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
