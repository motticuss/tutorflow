import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminPage.css';
import usePageTitle from '../hooks/usePageTitle';

const EMPTY_SERVICE = { title:'', subject:'', level:'High School', description:'', duration:60, price:50, tutorName:'', available:true };

const AdminPage = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('services');
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
usePageTitle('Admin Panel');

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data));
    api.get('/bookings').then(r => setBookings(r.data));
  }, []);

  const handle = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };

  const submit = async () => {
    try {
      if (editing) {
        const res = await api.put(`/services/${editing}`, form);
        setServices(s => s.map(x => x._id === editing ? res.data : x));
        setMsg('Service updated.');
      } else {
        const res = await api.post('/services', form);
        setServices(s => [res.data, ...s]);
        setMsg('Service created.');
      }
      setForm(EMPTY_SERVICE); setEditing(null); setShowForm(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving service.');
    }
  };

  const startEdit = (s) => {
    setForm({ ...s }); setEditing(s._id); setShowForm(true);
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    setServices(s => s.filter(x => x._id !== id));
    setMsg('Service deleted.');
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">Admin Panel</h1>

        <div className="dashboard-tabs" style={{marginBottom:28}}>
          <button className={`tab-btn ${tab==='services'?'active':''}`} onClick={() => setTab('services')}>Services</button>
          <button className={`tab-btn ${tab==='bookings'?'active':''}`} onClick={() => setTab('bookings')}>All Bookings</button>
        </div>

        {msg && <div className="admin-msg">{msg}</div>}

        {tab === 'services' && (
          <>
            <div className="admin-toolbar">
              <button className="btn btn-primary" onClick={() => { setForm(EMPTY_SERVICE); setEditing(null); setShowForm(true); }}>
                + Add Service
              </button>
            </div>

            {showForm && (
              <div className="admin-form card">
                <h3 className="form-heading">{editing ? 'Edit Service' : 'New Service'}</h3>
                <div className="form-grid">
                  {[['title','Title','text'],['tutorName','Tutor Name','text']].map(([n,l,t]) => (
                    <div className="form-group" key={n}>
                      <label>{l}</label>
                      <input name={n} type={t} value={form[n]} onChange={handle} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Subject</label>
                    <select name="subject" value={form.subject} onChange={handle}>
                      {['Mathematics','Science','English','History','Test Prep','Coding'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Level</label>
                    <select name="level" value={form.level} onChange={handle}>
                      {['Elementary','Middle School','High School','College','Adult / Professional'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input name="duration" type="number" value={form.duration} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label>Price (USD)</label>
                    <input name="price" type="number" value={form.price} onChange={handle} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" rows={3} value={form.description} onChange={handle} />
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={submit}>{editing ? 'Update' : 'Create'} Service</button>
                  <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="admin-services-list">
              {services.map(s => (
                <div className="admin-service-row card" key={s._id}>
                  <div className="asr-info">
                    <strong>{s.title}</strong>
                    <span className="asr-meta">{s.subject} · {s.level} · {s.duration}min · ${s.price}</span>
                  </div>
                  <div className="asr-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteService(s._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <div className="admin-bookings">
            {bookings.length === 0 ? <p className="empty-title" style={{color:'var(--ink-muted)'}}>No bookings yet.</p> : (
              <table className="bookings-table">
                <thead>
                  <tr>{['Student','Email','Service','Date','Time','Status'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.user?.name}</td>
                      <td>{b.user?.email}</td>
                      <td>{b.service?.title}</td>
                      <td>{new Date(b.date).toLocaleDateString()}</td>
                      <td>{b.time}</td>
                      <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
