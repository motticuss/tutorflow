import { Link } from 'react-router-dom';
import './HomePage.css';

const SUBJECTS = [
  { icon: '∑', name: 'Mathematics' },
  { icon: '⚗', name: 'Science' },
  { icon: '✍', name: 'English' },
  { icon: '🏛', name: 'History' },
  { icon: '📝', name: 'Test Prep' },
  { icon: '</>', name: 'Coding' },
];

const FEATURES = [
  { icon: '📅', title: 'Smart Booking', desc: 'Browse tutors, pick a time, and book in under a minute. No back-and-forth emails.' },
  { icon: '🎓', title: 'Expert Tutors', desc: 'Qualified tutors across subjects and grade levels — from elementary to college.' },
  { icon: '✨', title: 'AI Session Summaries', desc: 'After each session, get an AI-generated summary with key takeaways and what to study next.' },
];

const HomePage = () => (
  <div className="home-page">
    {/* Hero */}
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">AI-Powered Tutoring</span>
          <h1 className="page-title hero-title">
            Find Your<br />
            <em>Perfect Tutor.</em>
          </h1>
          <p className="hero-sub">
            Book one-on-one sessions with expert tutors and get AI-generated summaries
            of every lesson — so you always know exactly what to study next.
          </p>
          <div className="hero-cta">
            <Link to="/services" className="btn btn-primary btn-lg">Browse Tutors</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Get Started Free</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card card">
            <div className="hc-label">✨ AI Summary Generated</div>
            <p className="hc-title">Algebra II · Session #4</p>
            <p className="hc-item">✓ Quadratic equations</p>
            <p className="hc-item">✓ Completing the square</p>
            <p className="hc-item">✓ Graphing parabolas</p>
            <div className="hc-next">Next: Practice discriminants →</div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Everything you need to learn better</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Subjects */}
    <section className="subjects-section">
      <div className="container">
        <h2 className="section-title">Browse by subject</h2>
        <div className="subjects-grid">
          {SUBJECTS.map(s => (
            <Link key={s.name} to={`/services?subject=${s.name}`} className="subject-chip card">
              <span className="subject-icon">{s.icon}</span>
              <span className="subject-name">{s.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="cta-banner">
      <div className="container cta-inner">
        <h2 className="cta-title">Ready to level up your learning?</h2>
        <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
      </div>
    </section>
  </div>
);

export default HomePage;
