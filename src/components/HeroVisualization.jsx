import React, { useState, useEffect, useRef } from 'react';
import { 
  DoodleEye, 
  DoodleCamera, 
  DoodleCCTV, 
  DoodleFootprints, 
  DoodleClock, 
  DoodleHeatmap, 
  DoodleBrain, 
  DoodleSparkle 
} from './doodles/DoodleIndex';
import { Users, Activity, Layers, Flame, Eye, Play, Pause } from 'lucide-react';

export const HeroVisualization = () => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Simulated live tracks
  const [tracks, setTracks] = useState([
    { id: '#001', x: 25, y: 35, targetX: 45, targetY: 40, color: '#6C4AB6', label: 'Visitor 01', dwell: '14m', zone: 'Workspace A' },
    { id: '#002', x: 78, y: 25, targetX: 74, targetY: 30, color: '#4ECCA3', label: 'Visitor 02', dwell: '4m', zone: 'Espresso Bar' },
    { id: '#003', x: 18, y: 70, targetX: 35, targetY: 75, color: '#FF9E7D', label: 'Visitor 03', dwell: '22m', zone: 'Lounge Nook' },
    { id: '#004', x: 50, y: 55, targetX: 52, targetY: 58, color: '#8D68DC', label: 'Visitor 04', dwell: '35m', zone: 'Focus Pods' },
    { id: '#005', x: 12, y: 25, targetX: 28, targetY: 28, color: '#F59E0B', label: 'Visitor 05', dwell: '2m', zone: 'Reception' },
    { id: '#006', x: 80, y: 65, targetX: 68, targetY: 60, color: '#4ECCA3', label: 'Visitor 06', dwell: '18m', zone: 'Collaboration' },
  ]);

  // Trail history for animated paths
  const [trailPoints, setTrailPoints] = useState([
    [[15, 20], [20, 25], [25, 35]],
    [[65, 20], [72, 22], [78, 25]],
    [[10, 60], [14, 65], [18, 70]],
    [[45, 45], [48, 50], [50, 55]],
    [[8, 20], [10, 22], [12, 25]],
    [[85, 75], [82, 70], [80, 65]],
  ]);

  // Gentle autonomous wandering
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTracks((prev) =>
        prev.map((t, idx) => {
          // Wander slightly towards target or pick new target
          const dx = (Math.random() - 0.5) * 4;
          const dy = (Math.random() - 0.5) * 4;
          const newX = Math.min(88, Math.max(12, t.x + dx));
          const newY = Math.min(84, Math.max(16, t.y + dy));

          return {
            ...t,
            x: Number(newX.toFixed(1)),
            y: Number(newY.toFixed(1)),
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Playful Hand-drawn SVG Doodles Floating Around the Visualization */}
      <div style={{ position: 'absolute', top: '-28px', left: '-20px', zIndex: 5 }}>
        <DoodleEye size={42} color="var(--purple-primary)" accent="var(--mint-accent)" className="doodle-float" />
      </div>
      <div style={{ position: 'absolute', bottom: '-24px', right: '-15px', zIndex: 5 }}>
        <DoodleCCTV size={46} color="var(--plum-deep)" accent="var(--peach-accent)" className="doodle-float-alt" />
      </div>
      <div style={{ position: 'absolute', top: '45%', right: '-34px', zIndex: 5 }}>
        <DoodleFootprints size={38} color="var(--purple-vibrant)" accent="var(--mint-accent)" className="doodle-wobble" />
      </div>
      <div style={{ position: 'absolute', bottom: '-15px', left: '30%', zIndex: 5 }}>
        <DoodleSparkle size={26} color="#FF9E7D" />
      </div>

      {/* Main Glassmorphic Visual Card */}
      <div className="hero-visual-card">
        {/* Top Header Bar */}
        <div className="hero-visual-header">
          <div className="cam-indicator">
            <span className="cam-dot"></span>
            <span>360° FISHEYE CEILING FEED (LIVE)</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '6px' }}>
              • 30 FPS • 4K EQUIRECTANGULAR
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Live' : 'Paused'}</span>
            </button>

            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
            >
              <Flame size={13} />
              <span>Heatmap</span>
            </button>
          </div>
        </div>

        {/* The Spatial Floorplan Stage */}
        <div className="floorplan-stage">
          <div className="floorplan-grid-bg"></div>

          {/* Functional Zones Overlay */}
          {showZones && (
            <>
              {/* Zone 1: Reception */}
              <div className="floorplan-zone-box" style={{ left: '8%', top: '15%', width: '22%', height: '35%' }}>
                <span>🚪 Reception & Entry</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>High Flow • 1.4m dwell</span>
              </div>

              {/* Zone 2: Workspace A */}
              <div className="floorplan-zone-box" style={{ left: '35%', top: '12%', width: '32%', height: '42%' }}>
                <span>💻 Main Workspace</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--purple-primary)' }}>High Dwell • 38m dwell</span>
              </div>

              {/* Zone 3: Espresso Bar */}
              <div className="floorplan-zone-box" style={{ left: '72%', top: '15%', width: '22%', height: '32%', borderColor: 'rgba(52, 179, 138, 0.5)' }}>
                <span>☕ Espresso Bar</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--mint-accent)' }}>Peak Traffic Hotspot</span>
              </div>

              {/* Zone 4: Lounge */}
              <div className="floorplan-zone-box" style={{ left: '15%', top: '60%', width: '38%', height: '32%' }}>
                <span>🛋️ Velvet Lounge</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Relaxation • 22m dwell</span>
              </div>

              {/* Zone 5: Focus Pods */}
              <div className="floorplan-zone-box" style={{ left: '60%', top: '56%', width: '32%', height: '36%' }}>
                <span>📞 Focus & Pods</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Quiet Zone</span>
              </div>
            </>
          )}

          {/* Glowing Spatial Heatmap Blobs */}
          {showHeatmap && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.75 }}>
              {/* Hotspot over Espresso Bar */}
              <div style={{
                position: 'absolute',
                left: '72%',
                top: '22%',
                width: '120px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,110,80,0.7) 0%, rgba(245,158,11,0.4) 45%, rgba(108,74,182,0) 70%)',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(10px)',
              }} />

              {/* Hotspot over Workspace */}
              <div style={{
                position: 'absolute',
                left: '46%',
                top: '28%',
                width: '160px',
                height: '130px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,140,105,0.65) 0%, rgba(108,74,182,0.3) 50%, rgba(52,179,138,0) 75%)',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(14px)',
              }} />

              {/* Hotspot over Lounge */}
              <div style={{
                position: 'absolute',
                left: '30%',
                top: '72%',
                width: '130px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(141,104,220,0.5) 0%, rgba(78,204,163,0.3) 45%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(12px)',
              }} />
            </div>
          )}

          {/* SVG Movement Path Trajectories */}
          {showTrails && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <linearGradient id="pathGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C4AB6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6C4AB6" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="pathGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ECCA3" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4ECCA3" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Trajectory lines from entry to zones */}
              <path 
                d="M 10 25 Q 25 25 45 35" 
                fill="none" 
                stroke="url(#pathGrad1)" 
                strokeWidth="2.5" 
                strokeDasharray="4 4" 
              />
              <path 
                d="M 12 25 Q 40 18 78 26" 
                fill="none" 
                stroke="url(#pathGrad2)" 
                strokeWidth="2.5" 
                strokeDasharray="4 4" 
              />
              <path 
                d="M 10 25 Q 18 50 35 72" 
                fill="none" 
                stroke="#FF9E7D" 
                strokeWidth="2" 
                strokeDasharray="3 3" 
                opacity="0.75"
              />
            </svg>
          )}

          {/* Anonymous Detected People Markers */}
          {tracks.map((person) => (
            <div 
              key={person.id}
              className="person-avatar-marker"
              style={{ left: `${person.x}%`, top: `${person.y}%`, cursor: 'pointer', pointerEvents: 'auto' }}
              onClick={() => setSelectedPerson(person)}
            >
              <div className="person-radar-ring"></div>
              <div className="person-circle" style={{ background: person.color }}>
                {person.id.replace('#', '')}
              </div>
              <div style={{
                marginTop: '4px',
                background: 'rgba(37, 18, 43, 0.85)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '0.62rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(4px)',
              }}>
                {person.dwell}
              </div>
            </div>
          ))}

          {/* Selected Track Inspection Popover */}
          {selectedPerson && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'white',
              borderRadius: '12px',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-md)',
              border: '1.5px solid var(--purple-primary)',
              fontSize: '0.78rem',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div>
                <strong style={{ color: 'var(--plum-deep)', display: 'block' }}>
                  Anonymous Track: {selectedPerson.id}
                </strong>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Zone: {selectedPerson.zone} • Dwell: {selectedPerson.dwell}
                </span>
              </div>
              <button 
                onClick={() => setSelectedPerson(null)}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Live HUD Bottom Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.8rem',
          borderTop: '1px solid var(--lavender-border)',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} color="var(--purple-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                {tracks.length} People Detected
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} color="var(--mint-accent)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Traffic: <strong style={{ color: 'var(--mint-accent)' }}>Fluid Circulation</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Layer toggles:</span>
            <button 
              onClick={() => setShowTrails(!showTrails)} 
              style={{ color: showTrails ? 'var(--purple-primary)' : 'inherit', fontWeight: 600 }}
            >
              Trails {showTrails ? '✓' : '✗'}
            </button>
            •
            <button 
              onClick={() => setShowZones(!showZones)} 
              style={{ color: showZones ? 'var(--purple-primary)' : 'inherit', fontWeight: 600 }}
            >
              Zones {showZones ? '✓' : '✗'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
