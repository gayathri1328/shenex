import React, { useState } from 'react';
import { DoodlePerson, DoodleEye, DoodleSparkle } from '../components/doodles/DoodleIndex';
import { User, Lock, LogIn, UserPlus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/supabaseClient';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        user = await authService.signUp(username, password);
      } else {
        user = await authService.login(username, password);
      }

      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(37, 18, 43, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'var(--cream-card)',
        border: '1.5px solid var(--lavender-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        maxWidth: '440px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header with Doodle */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', marginBottom: '0.8rem' }}>
            <DoodlePerson size={54} color="var(--purple-primary)" accent="var(--mint-accent)" />
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            {isSignUp ? 'Create SHENEX Account' : 'Welcome to SHENEX'}
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isSignUp
              ? 'Register a unique username to access spatial intelligence'
              : 'Sign in with your username to load your analysis history'}
          </p>

          <span className="badge-pill badge-mint" style={{ marginTop: '10px', fontSize: '0.72rem' }}>
            Username Login • No Email Required
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--plum-deep)', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.75rem 1rem',
              border: '1.5px solid var(--lavender-border)',
              borderRadius: 'var(--radius-md)',
              background: '#FAF7F2',
            }}>
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                placeholder="e.g. spatial_analyst"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.92rem',
                  outline: 'none',
                  color: 'var(--text-dark)',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--plum-deep)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.75rem 1rem',
              border: '1.5px solid var(--lavender-border)',
              borderRadius: 'var(--radius-md)',
              background: '#FAF7F2',
            }}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.92rem',
                  outline: 'none',
                  color: 'var(--text-dark)',
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#C53030',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isSignUp ? (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => { setIsSignUp(false); setError(''); }}
                style={{ color: 'var(--purple-primary)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                onClick={() => { setIsSignUp(true); setError(''); }}
                style={{ color: 'var(--purple-primary)', fontWeight: 700, textDecoration: 'underline' }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
