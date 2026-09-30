import React, { useState } from 'react';
import { DoodleEye, DoodlePerson, DoodleSparkle } from './doodles/DoodleIndex';
import { Camera, BarChart3, LogOut, User, Menu, X, ArrowRight } from 'lucide-react';

export const Navigation = ({ 
  currentPage, 
  onNavigate, 
  currentUser, 
  onLogout,
  hasActiveAnalysis 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'privacy', label: 'Privacy' },
  ];

  const handleNav = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container nav-inner">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNav('landing')} 
          className="brand-logo" 
          aria-label="SHENEX Home"
        >
          <div className="brand-logo-icon">
            <DoodleEye size={26} color="#FFFFFF" accent="#4ECCA3" />
          </div>
          <span>SHENEX</span>
          <span className="badge-pill badge-mint" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            PR-02
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id)}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            </li>
          ))}

          {/* Direct link to Dashboard */}
          <li>
            <button
              onClick={() => handleNav('dashboard')}
              className={`nav-link ${['dashboard', 'zones', 'movement', 'insights'].includes(currentPage) ? 'active' : ''}`}
              style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <BarChart3 size={15} />
              <span>Dashboard</span>
            </button>
          </li>
        </ul>

        {/* User Auth & Actions */}
        <div className="nav-actions">
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                className="btn btn-secondary btn-sm"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'default',
                }}
              >
                <User size={14} color="var(--purple-primary)" />
                <span style={{ color: 'var(--plum-deep)' }}>@{currentUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem 0.7rem' }}
                title="Log Out of SHENEX"
                aria-label="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}

          <button 
            onClick={() => handleNav('upload')} 
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Camera size={16} />
            <span>Upload Video</span>
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          background: 'var(--cream-card)',
          borderBottom: '1px solid var(--lavender-border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              style={{ textAlign: 'left', padding: '0.6rem 0' }}
            >
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => handleNav('dashboard')}
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            style={{ textAlign: 'left', padding: '0.6rem 0', fontWeight: 700 }}
          >
            <span>Dashboard</span>
          </button>
        </div>
      )}
    </header>
  );
};
