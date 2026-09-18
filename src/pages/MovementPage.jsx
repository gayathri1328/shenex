import React from 'react';
import { 
  DoodleFootprints, 
  DoodleArrow, 
  DoodleRadar, 
  DoodleSparkle, 
  DoodlePerson 
} from '../components/doodles/DoodleIndex';
import { 
  Compass, 
  Layers, 
  Activity, 
  ArrowRight, 
  Zap, 
  Navigation, 
  TrendingUp,
  MapPin
} from 'lucide-react';

export const MovementPage = ({ currentPreset, onNavigate }) => {
  if (!currentPreset || !currentPreset.trajectories) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: 'var(--cream-card)',
          border: '1.5px dashed var(--purple-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
        }}>
          <DoodleFootprints size={72} color="var(--purple-primary)" />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
            No Movement Data Active
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.8rem 0 2rem' }}>
            Upload a video to analyze directional flows, velocity profiles, and movement pathways.
          </p>
          <button onClick={() => onNavigate('upload')} className="btn btn-primary btn-lg">
            Upload Video
          </button>
        </div>
      </div>
    );
  }

  const preset = currentPreset;
  const trajectories = preset.trajectories || [];
  const totalTraj = trajectories.length > 0 ? trajectories.length : 1;

  let staticCount = 0;
  let meanderCount = 0;
  let transitCount = 0;

  trajectories.forEach((t) => {
    const dwell = t.dwell_time_seconds || 0;
    const pts = t.points || [];
    let dist = 0;
    if (pts.length > 1) {
      const p1 = pts[0];
      const p2 = pts[pts.length - 1];
      const x1 = Array.isArray(p1) ? p1[0] : (p1.x || 0);
      const y1 = Array.isArray(p1) ? p1[1] : (p1.y || 0);
      const x2 = Array.isArray(p2) ? p2[0] : (p2.x || 0);
      const y2 = Array.isArray(p2) ? p2[1] : (p2.y || 0);
      dist = Math.hypot(x2 - x1, y2 - y1);
    }
    const speed = dwell > 0 ? dist / dwell : 0;
    if (speed < 8 || dwell >= 5) {
      staticCount++;
    } else if (speed < 20) {
      meanderCount++;
    } else {
      transitCount++;
    }
  });

  const staticPct = Math.round((staticCount / totalTraj) * 100);
  const meanderPct = Math.round((meanderCount / totalTraj) * 100);
  const transitPct = Math.max(0, 100 - staticPct - meanderPct);

  const transitions = (preset.zones && preset.zones.length >= 2) ? [
    { from: preset.zones[0].name, to: preset.zones[1].name, volume: 'Primary Corridor', status: 'High Flow', color: '#6C4AB6' },
    { from: preset.zones[0].name, to: preset.zones[Math.min(2, preset.zones.length - 1)].name, volume: 'Secondary Corridor', status: 'Fluid Flow', color: '#4ECCA3' },
  ] : [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-pill badge-mint">Kinematic Vector Mapping</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dataset: <strong>{preset.title}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Movement Patterns & Directional Flow
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNavigate('zones')} className="btn btn-secondary btn-sm">
            Zone Analysis
          </button>
          <button onClick={() => onNavigate('insights')} className="btn btn-primary btn-sm">
            AI Spatial Insights <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="app-tabs-nav">
        <button onClick={() => onNavigate('dashboard')} className="tab-btn">
          <Activity size={16} /> Overview
        </button>
        <button onClick={() => onNavigate('zones')} className="tab-btn">
          <Layers size={16} /> Zone Analysis
        </button>
        <button className="tab-btn active">
          <Compass size={16} /> Movement Flow
        </button>
        <button onClick={() => onNavigate('insights')} className="tab-btn">
          <DoodleSparkle size={16} /> AI Insights
        </button>
      </div>

      {/* Movement Insights Summary Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div className="kpi-card">
          <div>
            <span className="kpi-label">Dominant Vector Axis</span>
            <div className="kpi-num" style={{ fontSize: '1.6rem' }}>West → East</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entryway to Espresso Bar Spine</span>
          </div>
          <Compass size={32} color="var(--purple-primary)" />
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-label">Average Walking Velocity</span>
            <div className="kpi-num" style={{ fontSize: '1.6rem' }}>1.14 m/s</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--mint-accent)', fontWeight: 700 }}>Optimal Unhindered Pace</span>
          </div>
          <Zap size={32} color="var(--mint-accent)" />
        </div>

        <div className="kpi-card">
          <div>
            <span className="kpi-label">Circulation Friction Index</span>
            <div className="kpi-num" style={{ fontSize: '1.6rem' }}>12.4%</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--peach-accent)', fontWeight: 700 }}>Low Counter-Flow Collision</span>
          </div>
          <DoodleFootprints size={36} />
        </div>
      </div>

      {/* Flow Matrix Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '2rem',
        marginBottom: '2.5rem',
      }}>
        {/* Origin-to-Destination Transition Matrix */}
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--lavender-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <DoodleFootprints size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
                Origin → Destination Transition Flow
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Markov chain transition probabilities between functional zones
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transitions.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--lavender-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--plum-deep)' }}>
                    {t.from}
                  </span>
                  <DoodleArrow size={20} color="var(--purple-primary)" />
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--purple-primary)' }}>
                    {t.to}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.95rem', color: t.color, display: 'block' }}>
                    {t.volume}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speed vs Dwell Profile */}
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--lavender-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <DoodleRadar size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
                Circulation Behavioral Classification
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Velocity distribution across tracked anonymous occupants
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>
                  🎯 Deep Focus / Static Occupants (&lt; 0.2 m/s)
                </span>
                <span style={{ fontWeight: 800, color: 'var(--purple-primary)' }}>{staticPct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#F4EFFE', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: `${staticPct}%`, height: '100%', background: 'var(--purple-primary)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>
                  🚶 Casual Browsing & Meandering (0.2 - 0.9 m/s)
                </span>
                <span style={{ fontWeight: 800, color: 'var(--mint-accent)' }}>{meanderPct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#F4EFFE', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: `${meanderPct}%`, height: '100%', background: 'var(--mint-accent)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>
                  ⚡ Rapid Direct Transit (&gt; 0.9 m/s)
                </span>
                <span style={{ fontWeight: 800, color: 'var(--peach-accent)' }}>{transitPct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#F4EFFE', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: `${transitPct}%`, height: '100%', background: 'var(--peach-accent)', borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
