import React from 'react';
import { DoodleEye, DoodlePerson, DoodleCCTV, DoodleSparkle, DoodleRadar } from '../components/doodles/DoodleIndex';
import { ShieldCheck, EyeOff, Lock, UserX, Server, CheckCircle2 } from 'lucide-react';

export const PrivacyPage = ({ onNavigate }) => {
  const principles = [
    {
      icon: EyeOff,
      title: 'Zero Facial Recognition',
      desc: 'SHENEX does not extract facial embeddings, landmarks, or biometric vectors. Convolutional models focus entirely on upper-body centroid bounding boxes for spatial positioning.',
    },
    {
      icon: UserX,
      title: 'Anonymous Ephemeral Tracking Tokens',
      desc: 'All tracked individuals are represented by anonymous runtime session tokens (e.g., #001, #002) that expire as soon as the individual exits the camera’s field of view.',
    },
    {
      icon: Lock,
      title: 'No Biometric or PII Storage',
      desc: 'Video frames are processed in memory and discarded. No personal identifiable information (PII), names, demographics, or permanent identity databases are ever stored.',
    },
    {
      icon: Server,
      title: 'Local Edge Processing Capable',
      desc: 'The CV pipeline is lightweight and engineered to run directly on edge hardware or localized on-premise compute nodes without transmitting raw video to third-party clouds.',
    },
  ];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div className="section-header-center">
        <span className="badge-pill badge-mint">
          <ShieldCheck size={16} />
          <span>Privacy by Design</span>
        </span>
        <h1 className="section-title">Ethical Spatial Computer Vision</h1>
        <p className="section-lead">
          Understanding spatial dynamics and indoor movement without compromising personal privacy or human dignity.
        </p>
      </div>

      {/* Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--plum-deep) 0%, var(--plum-mid) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '4rem',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '3rem',
        alignItems: 'center',
      }}>
        <div>
          <span className="badge-pill badge-mint" style={{ marginBottom: '1rem' }}>
            PR-02 Core Guarantee
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            We measure space and flow. <br />Not identities.
          </h2>
          <p style={{ color: '#E8DCFC', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Traditional surveillance focuses on identity surveillance and security scrutiny. SHENEX flips the paradigm: our purpose is <strong>spatial ergonomics</strong> — helping architects, store designers, and facility engineers understand dwell time, traffic congestion, and floorplan flow.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#80ED99', fontSize: '0.88rem', fontWeight: 700 }}>
            <CheckCircle2 size={18} />
            <span>GDPR, CCPA & Privacy-First Spatial Intelligence Architecture</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          textAlign: 'center',
        }}>
          <DoodleEye size={74} color="#FFFFFF" accent="#4ECCA3" />
          <h3 style={{ color: 'white', fontSize: '1.2rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Anonymous Centroids Only
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#C8BBD6', lineHeight: 1.5 }}>
            Detections are treated as dimensionless point coordinates (x, y, t) on a 2D architectural coordinate plane.
          </p>
        </div>
      </div>

      {/* 4 Core Ethical Principles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
        marginBottom: '4rem',
      }}>
        {principles.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} style={{
              background: 'var(--cream-card)',
              border: '1.5px solid var(--lavender-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--lavender-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--purple-primary)',
                marginBottom: '1rem',
              }}>
                <Icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--plum-deep)', fontWeight: 700, marginBottom: '0.6rem' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
