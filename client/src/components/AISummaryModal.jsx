import { useState } from 'react';
import api from '../services/api';
import './AISummaryModal.css';

const AISummaryModal = ({ booking, onClose, onSaved }) => {
  const [notes, setNotes] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [summary, setSummary] = useState(booking.aiSummary || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const viewOnly = !!booking.aiSummary && !notes;

  const handleGenerate = async () => {
    if (notes.trim().length < 10) {
      setError('Please write at least a few words about what was covered.');
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await api.post('/ai/generate-summary', {
        bookingId: booking._id,
        sessionNotes: notes,
        difficulties,
      });
      setSummary(res.data.summary);
      if (onSaved) onSaved(booking._id, res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">✨ AI Session Summary</h2>
            <p className="modal-subtitle">{booking.service?.title}</p>
          </div>
          <button className="btn btn-ghost modal-close" onClick={onClose}>✕</button>
        </div>

        {!summary && (
          <div className="modal-form">
            <div className="form-group">
              <label>What was covered in this session?</label>
              <textarea
                rows={4}
                placeholder="e.g. We worked through quadratic equations, practiced factoring, and reviewed the quadratic formula…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Any questions or difficulties that came up? <span className="optional">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="e.g. I struggled with completing the square and word problems involving projectile motion…"
                value={difficulties}
                onChange={e => setDifficulties(e.target.value)}
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button className="btn btn-primary generate-btn" onClick={handleGenerate} disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Generating…</> : '✨ Generate Summary'}
            </button>
          </div>
        )}

        {summary && (
          <div className="summary-output">
            <div className="summary-tag">AI-Generated Summary</div>
            <div className="summary-content">
              {summary.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h4 key={i} className="summary-heading">{line.replace(/\*\*/g, '')}</h4>;
                }
                if (line.startsWith('- ') || line.startsWith('• ')) {
                  return <p key={i} className="summary-bullet">{line.replace(/^[-•]\s/, '')}</p>;
                }
                return line.trim() ? <p key={i} className="summary-para">{line}</p> : <br key={i} />;
              })}
            </div>
            <button className="btn btn-outline" style={{marginTop:16}} onClick={() => setSummary('')}>
              ← Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummaryModal;
