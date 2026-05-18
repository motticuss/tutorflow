import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AuthPages.css';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What was the name of your elementary school?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the make of your first car?",
  "What is your oldest sibling's middle name?",
];

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {showForgot ? (
        <ForgotPasswordForm onBack={() => setShowForgot(false)} />
      ) : (
        <div className="auth-card card">
          <div className="auth-brand">
            <span className="brand-dot" />
            TutorFlow
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Log in to manage your bookings and view AI session summaries.</p>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          <button className="forgot-link" onClick={() => setShowForgot(true)}>
            Forgot password?
          </button>

          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary auth-submit" onClick={submit} disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
          <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      )}
    </div>
  );
};

const ForgotPasswordForm = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setQuestion(res.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, securityAnswer: answer, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card card">
      <div className="auth-brand">
        <span className="brand-dot" />
        TutorFlow
      </div>

      {step === 1 && (
        <>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-sub">Enter your email and we'll ask your security question.</p>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary auth-submit" onClick={handleEmailSubmit} disabled={loading}>
            {loading ? 'Looking up…' : 'Continue'}
          </button>
          <button className="forgot-link" onClick={onBack}>← Back to login</button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="auth-title">Security Question</h1>
          <p className="auth-sub">Answer correctly to reset your password.</p>
          <div className="form-group">
            <label>Security Question</label>
            <input type="text" value={question} disabled style={{background:'var(--cream-dark)'}} />
          </div>
          <div className="form-group">
            <label>Your Answer</label>
            <input type="text" placeholder="Your answer" value={answer} onChange={e => setAnswer(e.target.value)} />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="At least 6 characters" value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset()} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary auth-submit" onClick={handleReset} disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
          <button className="forgot-link" onClick={() => setStep(1)}>← Back</button>
        </>
      )}

      {step === 3 && (
        <div className="reset-success">
          <div className="success-icon">✓</div>
          <h1 className="auth-title">Password Reset!</h1>
          <p className="auth-sub">Your password has been updated. You can now log in.</p>
          <button className="btn btn-primary auth-submit" onClick={onBack}>Back to Login</button>
        </div>
      )}
    </div>
  );
};

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    securityQuestion: SECURITY_QUESTIONS[0], securityAnswer: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.securityAnswer.trim()) { setError('Please provide a security answer.'); return; }
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.securityQuestion, form.securityAnswer);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <span className="brand-dot" />
          TutorFlow
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join TutorFlow and start booking tutoring sessions today.</p>

        <div className="form-group">
          <label>Full Name</label>
          <input name="name" type="text" placeholder="Jane Smith" value={form.name} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="At least 6 characters" value={form.password} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Security Question</label>
          <select name="securityQuestion" value={form.securityQuestion} onChange={handle}>
            {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Security Answer</label>
          <input name="securityAnswer" type="text" placeholder="Your answer"
            value={form.securityAnswer} onChange={handle}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {error && <p className="error-msg">{error}</p>}
        <button className="btn btn-primary auth-submit" onClick={submit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
};