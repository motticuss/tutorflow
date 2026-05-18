import './BookingCard.css';

const BookingCard = ({ booking, onCancel, onSummary }) => {
  const dateStr = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="booking-card card">
      <div className="booking-card-header">
        <div>
          <h3 className="booking-service-title">{booking.service?.title || 'Tutoring Session'}</h3>
          <p className="booking-meta">with {booking.service?.tutorName} · {booking.service?.subject}</p>
        </div>
        <span className={`badge badge-${booking.status}`}>{booking.status}</span>
      </div>
      <div className="booking-card-body">
        <div className="booking-detail">
          <span className="detail-icon">📅</span>
          <span>{dateStr}</span>
        </div>
        <div className="booking-detail">
          <span className="detail-icon">🕐</span>
          <span>{booking.time}</span>
        </div>
        <div className="booking-detail">
          <span className="detail-icon">⏱</span>
          <span>{booking.service?.duration} minutes</span>
        </div>
      </div>

      {booking.aiSummary && (
        <div className="booking-summary-preview">
          <span className="summary-label">✨ AI Summary saved</span>
          <button className="btn btn-ghost btn-sm" onClick={() => onSummary(booking)}>View</button>
        </div>
      )}

      <div className="booking-card-actions">
        {booking.status === 'upcoming' && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => onSummary(booking)}>
              ✨ Generate Summary
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onCancel(booking._id)}>
              Cancel
            </button>
          </>
        )}
        {booking.status === 'completed' && !booking.aiSummary && (
          <button className="btn btn-outline btn-sm" onClick={() => onSummary(booking)}>
            ✨ Generate AI Summary
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
