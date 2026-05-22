import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import AISummaryModal from '../components/AISummaryModal';
import './DashboardPage.css';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    api.get('/bookings/my')
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await api.patch(`/bookings/${id}/cancel`);
    setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'cancelled' } : bk));
  };

  const handleSummaryUpdate = (bookingId, summary) => {
    setBookings(b => b.map(bk => bk._id === bookingId ? { ...bk, aiSummary: summary, status: 'completed' } : bk));
  };

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming') return b.status === 'upcoming';
    if (tab === 'completed') return b.status === 'completed';
    if (tab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const counts = {
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">My Dashboard</h1>
            <p className="dashboard-welcome">Welcome back, {user?.name?.split(' ')[0]}! </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card card">
            <span className="stat-num">{counts.upcoming}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-card card">
            <span className="stat-num">{counts.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card card">
            <span className="stat-num">{bookings.filter(b => b.aiSummary).length}</span>
            <span className="stat-label">AI Summaries</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {['upcoming','completed','cancelled'].map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {counts[t] > 0 && <span className="tab-count">{counts[t]}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state card">
            <p className="empty-title">No {tab} bookings yet.</p>
            {tab === 'upcoming' && <Link to="/services" className="btn btn-primary" style={{marginTop:16}}>Browse Services</Link>}
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(b => (
              <BookingCard
                key={b._id}
                booking={b}
                onCancel={handleCancel}
                onSummary={setSelectedBooking}
              />
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <AISummaryModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSaved={(id, summary) => { handleSummaryUpdate(id, summary); setSelectedBooking(null); }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
