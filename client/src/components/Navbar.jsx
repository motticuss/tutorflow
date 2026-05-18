import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-dot" />
          TutorFlow
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link className={isActive('/')} to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link className={isActive('/services')} to="/services" onClick={() => setMenuOpen(false)}>Services</Link>

          {user ? (
            <>
              <Link className={isActive('/dashboard')} to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {user.role === 'admin' && (
                <Link className={isActive('/admin')} to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button className="btn btn-outline nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className={isActive('/login')} to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
