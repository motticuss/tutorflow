import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ServiceDetailPage.css';

const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/services/${id}`)
      .then(res => setService(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!date || !time) { setError('Please select a date and time.'); return; }
    setBooking(true); setError('');
    try {
      await api.post('/bookings', { service: id, date, time });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className="spinner" style={{marginTop:80}} />;
  if (!service) return <div className="container" style={{padding:'80px 24px',textAlign:'center'}}>Service not found.</div>;

  return (
    <div className="service-detail-page">
      <div className="container">
        <Link to="/services" className="back-link">← Back to Services</Link>

        <div className="detail-layout">
          {/* Info */}
          <div className="detail-info">
            <span className="service-level">{service.level}</span>
            <h1 className="page-title detail-title">{service.title}</h1>
            <p className="detail-tutor">Taught by <strong>{service.tutorName}</strong></p>
            <div className="detail-pills">
              <span className="meta-pill">{service.subject}</span>
              <span className="meta-pill">{service.duration} minutes</span>
              <span className="meta-pill meta-price">${service.price}/session</span>
            </div>
            <p className="detail-desc">{service.description}</p>

            <div className="detail-feature card">
              <h4>✨ AI Session Summary Included</h4>
              <p>After your session, use our AI Summary Generator to get a personalized breakdown of what you covered, key takeaways, and suggested follow-up topics.</p>
            </div>
          </div>

          {/* Booking panel */}
          <div className="booking-panel card">
            {success ? (
              <div className="booking-success">
                <div className="success-icon">✓</div>
                <h3>Booking Confirmed!</h3>
                <p>Your session has been booked for {new Date(date).toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})} at {time}.</p>
                <Link to="/dashboard" className="btn btn-primary" style={{marginTop:16}}>View My Bookings</Link>
              </div>
            ) : (
              <>
                <h3 className="panel-title">Book this Session</h3>
                <p className="panel-price">${service.price} <span>per session</span></p>

                <div className="form-group">
                  <label>Select Date</label>
                  <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Select Time</label>
                  <div className="time-slots">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        className={`time-slot ${time === t ? 'selected' : ''}`}
                        onClick={() => setTime(t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button className="btn btn-primary book-btn" onClick={handleBook} disabled={booking}>
                  {booking ? 'Booking…' : user ? 'Confirm Booking' : 'Login to Book'}
                </button>

                {!user && (
                  <p className="panel-note">
                    <Link to="/login">Log in</Link> or <Link to="/register">register</Link> to book a session.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
