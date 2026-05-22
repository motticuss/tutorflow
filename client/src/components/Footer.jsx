import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <span className="brand-dot" />
        TutorFlow
        <p className="footer-tagline">AI-powered tutoring, simplified.</p>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/services">Browse Services</Link>
          <Link to="/register">Get Started</Link>
          <Link to="/login">Log In</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>© {new Date().getFullYear()} TutorFlow. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;