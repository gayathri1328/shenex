import React from 'react';
import { DoodleEye, DoodleSparkle } from '../components/doodles/DoodleIndex';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = ({ onNavigate }) => {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto 1.5rem' }}>
        <DoodleEye size={96} color="var(--purple-primary)" accent="var(--mint-accent)" className="doodle-wobble" />
        <div style={{ position: 'absolute', top: '-10px', right: '-15px' }}>
          <DoodleSparkle size={32} />
        </div>
      </div>

      <span className="badge-pill badge-peach" style={{ marginBottom: '1rem' }}>
        Coordinate Error 404
      </span>

      <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '0.8rem' }}>
        Out of the Camera's Field of View
      </h1>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
        The spatial zone or page you are looking for has moved beyond the 360° panoramic horizon. Let's return to known coordinates.
      </p>

      <button onClick={() => onNavigate('landing')} className="btn btn-primary btn-lg">
        <Home size={18} />
        <span>Return to SHENEX Home</span>
      </button>
    </div>
  );
};
