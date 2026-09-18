import React, { useState } from 'react';
import { DoodleEye, DoodlePerson, DoodleSparkle } from './doodles/DoodleIndex';
import { Camera, BarChart3, History, LogIn, LogOut, User, Menu, X, ArrowRight } from 'lucide-react';

export const Navigation = ({ 
  currentPage, 
  onNavigate, 
  currentUser, 
  onOpenAuth, 
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

          {/* Direct link to Dashboard when active */}
          <li>
            <button
              onClick={() => handleNav('dashboard')}
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              style={{ fontWeight: 700 }}
            >
              <BarChart3 size={15} />
              Dashboard
            </button>
          </li>

          {/* History link */}
          <li>
            <button
              onClick={() => handleNav('history')}
              className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
            >
              <History size={15} />
              History
            </button>
          </li>
        </ul>

        {/* User Auth & Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleNav('history')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <User size={14} color="var(--purple-primary)" />
                <span>@{currentUser.username}</span>
              </button>
              <button
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.7rem' }}
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary btn-sm"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}

          <button 
            onClick={() => handleNav('upload')} 
            className="btn btn-primary btn-sm"
          >
            <Camera size={16} />
            <span>Upload Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
