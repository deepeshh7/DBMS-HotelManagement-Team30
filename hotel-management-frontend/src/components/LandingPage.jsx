import React from 'react';

export default function LandingPage({ onShowLogin }) {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <img src="/caesars-logo.svg" alt="Caesars Palace" style={{height: '60px'}} />
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#rooms">Rooms</a>
            <a href="#amenities">Amenities</a>
            <a href="#contact">Contact</a>
            <button className="btn btn-outline" onClick={() => onShowLogin('customer')}>
              Book Now
            </button>
            <button className="btn btn-primary" onClick={() => onShowLogin('admin')}>
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Caesars Palace</h1>
          <p className="hero-subtitle">Experience Legendary Luxury in Las Vegas Style</p>
          <div className="hero-buttons">
            <button className="btn btn-large btn-primary" onClick={() => onShowLogin('customer')}>
              Book Your Stay
            </button>
            <button className="btn btn-large btn-outline-white">
              Explore Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="amenities">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛏️</div>
              <h3>Luxury Rooms</h3>
              <p>Spacious and elegantly designed rooms with modern amenities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Fine Dining</h3>
              <p>World-class restaurants serving international cuisine</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💆</div>
              <h3>Spa & Wellness</h3>
              <p>Rejuvenate your body and mind at our premium spa</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏊</div>
              <h3>Swimming Pool</h3>
              <p>Olympic-sized pool with stunning city views</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Free Parking</h3>
              <p>Complimentary valet parking for all guests</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📶</div>
              <h3>High-Speed WiFi</h3>
              <p>Stay connected with free high-speed internet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section className="rooms-section" id="rooms">
        <div className="container">
          <h2 className="section-title">Our Rooms</h2>
          <div className="rooms-grid">
            <div className="room-showcase-card">
              <div className="room-image single-room"></div>
              <div className="room-info">
                <h3>Single Room</h3>
                <p className="room-desc">Perfect for solo travelers seeking comfort and privacy</p>
                <p className="room-price">Starting from ₹1,500/night</p>
                <button className="btn btn-primary" onClick={() => onShowLogin('customer')}>
                  Book Now
                </button>
              </div>
            </div>
            <div className="room-showcase-card">
              <div className="room-image double-room"></div>
              <div className="room-info">
                <h3>Double Room</h3>
                <p className="room-desc">Spacious rooms ideal for couples or business travelers</p>
                <p className="room-price">Starting from ₹2,500/night</p>
                <button className="btn btn-primary" onClick={() => onShowLogin('customer')}>
                  Book Now
                </button>
              </div>
            </div>
            <div className="room-showcase-card">
              <div className="room-image suite-room"></div>
              <div className="room-info">
                <h3>Suite</h3>
                <p className="room-desc">Luxurious suites with separate living areas</p>
                <p className="room-price">Starting from ₹5,000/night</p>
                <button className="btn btn-primary" onClick={() => onShowLogin('customer')}>
                  Book Now
                </button>
              </div>
            </div>
            <div className="room-showcase-card">
              <div className="room-image deluxe-room"></div>
              <div className="room-info">
                <h3>Deluxe Room</h3>
                <p className="room-desc">Premium rooms with panoramic city views</p>
                <p className="room-price">Starting from ₹7,500/night</p>
                <button className="btn btn-primary" onClick={() => onShowLogin('customer')}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>3570 Las Vegas Blvd South<br />Las Vegas, NV 89109</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (866) 227-5938<br />+1 (702) 731-7110</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@caesarspalace.com<br />reservations@caesarspalace.com</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <input type="text" placeholder="Your Name" className="form-input" />
              <input type="email" placeholder="Your Email" className="form-input" />
              <textarea placeholder="Your Message" className="form-input" rows="4"></textarea>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Caesars Palace</h4>
              <p>Experience the grandeur of ancient Rome with modern luxury and world-class service.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#rooms">Rooms</a>
              <a href="#amenities">Amenities</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#facebook">Facebook</a>
                <a href="#twitter">Twitter</a>
                <a href="#instagram">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Caesars Palace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
