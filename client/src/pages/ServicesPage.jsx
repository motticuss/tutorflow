import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';
import './ServicesPage.css';

const LEVELS = ['', 'Elementary', 'Middle School', 'High School', 'College', 'Adult / Professional'];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const subject = searchParams.get('subject') || '';
  const level = searchParams.get('level') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (subject) params.subject = subject;
    if (level) params.level = level;
    api.get('/services', { params })
      .then(res => setServices(res.data))
      .finally(() => setLoading(false));
  }, [subject, level]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    setSearchParams(next);
  };

  const filtered = services.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="services-page">
      <div className="container">
        <div className="services-header">
          <h1 className="page-title">Browse Tutoring Services</h1>
          <p className="services-sub">Find the right tutor for every subject and skill level.</p>
        </div>

        <div className="services-layout">
          {/* Filters */}
          <aside className="filters-sidebar card">
            <h3 className="filters-title">Filters</h3>
            <div className="form-group">
              <label>Search</label>
              <input
                type="text" placeholder="Subject or keyword…"
                value={search}
                onChange={e => setParam('search', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select value={subject} onChange={e => setParam('subject', e.target.value)}>
                <option value="">All Subjects</option>
                {['Mathematics','Science','English','History','Test Prep','Coding'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Grade Level</label>
              <select value={level} onChange={e => setParam('level', e.target.value)}>
                {LEVELS.map(l => <option key={l} value={l}>{l || 'All Levels'}</option>)}
              </select>
            </div>
            {(subject || level || search) && (
              <button className="btn btn-ghost clear-btn" onClick={() => setSearchParams({})}>
                ✕ Clear filters
              </button>
            )}
          </aside>

          {/* Results */}
          <div className="services-results">
            {loading ? (
              <div className="spinner" />
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <p>No services found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <p className="results-count">{filtered.length} service{filtered.length !== 1 ? 's' : ''} found</p>
                <div className="services-grid">
                  {filtered.map(s => <ServiceCard key={s._id} service={s} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
