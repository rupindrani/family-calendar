import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [step, setStep] = useState('choose'); // 'choose' | 'create' | 'join'
  const [form, setForm] = useState({ name: '', email: '', password: '', familyName: '', inviteCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, password: form.password };
      if (step === 'join') {
        if (!form.inviteCode.trim()) { setError('Please enter an invite code'); setLoading(false); return; }
        payload.inviteCode = form.inviteCode.trim().toUpperCase();
      } else {
        payload.familyName = form.familyName.trim() || `${form.name}'s Family`;
      }
      await register(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1 — choose path
  if (step === 'choose') {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.icon}>🏠</span>
            <h1>Family Calendar</h1>
            <p>Get started in seconds</p>
          </div>
          <div className={styles.choiceGrid}>
            <button className={styles.choiceCard} onClick={() => setStep('create')}>
              <span className={styles.choiceIcon}>🆕</span>
              <strong>Create a Family</strong>
              <p>Start fresh and invite your family members</p>
            </button>
            <button className={styles.choiceCard} onClick={() => setStep('join')}>
              <span className={styles.choiceIcon}>🔗</span>
              <strong>Join a Family</strong>
              <p>Use an invite code from a family member</p>
            </button>
          </div>
          <p className={styles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2 — fill in details
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>{step === 'create' ? '🆕' : '🔗'}</span>
          <h1>{step === 'create' ? 'Create Your Family' : 'Join a Family'}</h1>
          <p>{step === 'create' ? 'Set up your family calendar' : 'Enter your invite code to join'}</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Your Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          {step === 'create' ? (
            <div className={styles.field}>
              <label>Family Name <span className={styles.optional}>(optional)</span></label>
              <input
                type="text"
                value={form.familyName}
                onChange={e => setForm({ ...form, familyName: e.target.value })}
                placeholder="e.g. The Smith Family"
              />
            </div>
          ) : (
            <div className={styles.field}>
              <label>Invite Code</label>
              <input
                type="text"
                value={form.inviteCode}
                onChange={e => setForm({ ...form, inviteCode: e.target.value.toUpperCase() })}
                placeholder="e.g. A1B2C3D4"
                maxLength={8}
                style={{ letterSpacing: '3px', fontWeight: 600, textTransform: 'uppercase' }}
                required
              />
              <span className={styles.hint}>Ask a family member for their 8-character code</span>
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : step === 'create' ? 'Create Account & Family' : 'Join & Create Account'}
          </button>
        </form>

        <button className={styles.backBtn} onClick={() => { setStep('choose'); setError(''); }}>
          ← Back
        </button>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
