import React, { useState } from 'react';
import { DoodleEye, DoodlePerson, DoodleSparkle, DoodleRadar } from '../components/doodles/DoodleIndex';
import { User, Lock, LogIn, UserPlus, AlertCircle, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { authService } from '../services/supabaseClient';

export const SignInPage = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Background Doodles */}
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '10%',
        opacity: 0.25,
        pointerEvents: 'none',
        animation: 'doodleFloat 6s ease-in-out infinite alternate',
      }}>
        <DoodleEye size={64} color="var(--purple-primary)" />
      </div>

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '12%',
        opacity: 0.25,
        pointerEvents: 'none',
        animation: 'doodleFloat 7s ease-in-out infinite alternate-reverse',
      }}>
        <DoodleRadar size={72} color="var(--mint-accent)" />
      </div>

      {/* Main Sign-In Card */}
      <div style={{
        background: 'var(--cream-card)',
        border: '1.5px solid var(--lavender-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2.5rem',
        maxWidth: '460px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        zIndex: 10,
        animation: 'fadeInSlideUp 0.5s ease-out forwards',
      }}>
        {/* Brand & Doodle Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background: 'var(--lavender-soft)',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <DoodlePerson size={44} color="var(--purple-primary)" accent="var(--mint-accent)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--plum-deep)', letterSpacing: '-0.02em' }}>
              SHENEX
            </span>
            <span className="badge-pill badge-mint" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              PR-02
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '0.4rem' }}>
            {isSignUp ? 'Create your Account' : 'Sign in to continue'}
          </h2>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {isSignUp
              ? 'Register with a username to access real-time spatial intelligence'
              : 'Enter your username to access your computer vision dashboard'}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            background: '#FFF0EB',
            border: '1px solid #FF8C69',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: '#A72D1D',
            animation: 'fadeInSlideUp 0.3s ease',
          }}>
            <AlertCircle size={18} color="#FF8C69" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--plum-deep)', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.8rem 1rem',
              border: '1.5px solid var(--lavender-border)',
              borderRadius: 'var(--radius-md)',
              background: '#FAF7F2',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}>
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                placeholder="e.g. analyst_01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: 'var(--plum-deep)',
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
              padding: '0.8rem 1rem',
              border: '1.5px solid var(--lavender-border)',
              borderRadius: 'var(--radius-md)',
              background: '#FAF7F2',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
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
                  fontSize: '0.95rem',
                  outline: 'none',
                  color: 'var(--plum-deep)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 700,
              width: '100%',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : isSignUp ? (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign-In vs Sign-Up */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.8rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--lavender-border)',
        }}>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Already registered on SHENEX?' : 'First time using SHENEX?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--purple-primary)',
              fontWeight: 800,
              fontSize: '0.86rem',
              marginLeft: '6px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isSignUp ? 'Sign In' : 'Create an Account'}
          </button>
        </div>

        {/* Security / Privacy Guarantee */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <ShieldCheck size={14} color="var(--mint-accent)" />
          <span>Zero biometric identification • Real-time anonymous tracking</span>
        </div>
      </div>
    </div>
  );
};
