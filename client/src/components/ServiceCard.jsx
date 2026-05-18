import { Link } from 'react-router-dom';
import './ServiceCard.css';

const SUBJECT_ICONS = {
  Mathematics: '∑', Science: '⚗', English: '✍', History: '🏛',
  'Test Prep': '📝', Coding: '</>', Default: '📚'
};

const ServiceCard = ({ service }) => {
  const icon = SUBJECT_ICONS[service.subject] || SUBJECT_ICONS.Default;

  return (
    <div className="service-card card">
      <div className="service-card-icon">{icon}</div>
      <div className="service-card-body">
        <span className="service-level">{service.level}</span>
        <h3 className="service-title">{service.title}</h3>
        <p className="service-tutor">with {service.tutorName}</p>
        <p className="service-desc">{service.description.slice(0, 110)}…</p>
      </div>
      <div className="service-card-footer">
        <div className="service-meta">
          <span className="meta-pill">{service.duration} min</span>
          <span className="meta-pill meta-price">${service.price}/session</span>
        </div>
        <Link to={`/services/${service._id}`} className="btn btn-primary">Book Now</Link>
      </div>
    </div>
  );
};

export default ServiceCard;
