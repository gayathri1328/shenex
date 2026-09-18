import React from 'react';
import { DoodleEye, DoodleCCTV, DoodleSparkle, DoodleRadar } from './doodles/DoodleIndex';
import { Shield, EyeOff, Sparkles, Heart } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', padding: '8px', borderRadius: '12px' }}>
                <DoodleEye size={28} color="#FFFFFF" accent="#4ECCA3" />
              </div>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                SHENEX
              </span>
            </div>
            <p style={{ color: '#C8BBD6', fontSize: '0.95rem', marginBottom: '1.2rem', maxWidth: '360px' }}>
              "See the Space. Understand the Movement." — AI-powered computer vision platform analyzing 360° omnidirectional surveillance footage to extract deep spatial and human movement intelligence.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#80ED99', fontSize: '0.82rem', fontWeight: 600 }}>
              <Shield size={16} />
              <span>100% Anonymous Centroid Tracking • Zero Facial Recognition</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-col">
            <h4>Application</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('dashboard')}>Analytics Dashboard</button></li>
              <li><button onClick={() => onNavigate('zones')}>Zone Heatmap Analysis</button></li>
              <li><button onClick={() => onNavigate('movement')}>Movement Patterns</button></li>
              <li><button onClick={() => onNavigate('insights')}>AI Spatial Insights</button></li>
              <li><button onClick={() => onNavigate('upload')}>Upload 360° Footage</button></li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="footer-col">
            <h4>Hackathon PR-02</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('features')}>Core CV Features</button></li>
              <li><button onClick={() => onNavigate('how-it-works')}>6-Stage Pipeline</button></li>
              <li><button onClick={() => onNavigate('privacy')}>Privacy Architecture</button></li>
              <li><a href="#demo" onClick={(e) => { e.preventDefault(); onNavigate('upload'); }}>Sample Presets</a></li>
            </ul>
          </div>

          {/* Visual Badge */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4>CV Engine Status</h4>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ECCA3', display: 'inline-block' }}></span>
                <span style={{ fontSize: '0.82rem', color: '#FFFFFF', fontWeight: 700 }}>Computer Vision Active</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#A99BB8' }}>
                Equirectangular Unwrapping, ByteTrack Object Tracking, and KDE Heatmap Synthesis ready.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} SHENEX • Built with care for Hackathon Problem PR-02.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Handcrafted with Cute Doodles & Spatial AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
