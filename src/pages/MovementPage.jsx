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
  MapPin,
  Sparkles,
  BarChart3,
  Camera
} from 'lucide-react';

export const MovementPage = ({ currentPreset, onNavigate }) => {
  // Empty State when no video has been analyzed
  if (!currentPreset || !currentPreset.trajectories || currentPreset.trajectories.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '540px',
          margin: '0 auto',
          background: 'var(--cream-card)',
          border: '1.5px dashed var(--purple-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2.5rem',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeInSlideUp 0.4s ease',
        }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <DoodleFootprints size={76} color="var(--purple-primary)" />
          </div>
          <span className="badge-pill badge-mint" style={{ marginBottom: '0.8rem' }}>
            Movement Analysis Module
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '0.5rem', marginBottom: '0.8rem' }}>
            No video analyzed yet.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 2.2rem', maxWidth: '420px' }}>
            Movement trajectories will appear after video analysis is executed on an uploaded video.
          </p>
          <button 
            onClick={() => onNavigate('upload')} 
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Camera size={18} />
            <span>Upload Video</span>
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
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem', animation: 'fadeInSlideUp 0.35s ease' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.8rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-pill badge-mint">Kinematic Vector Mapping</span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--purple-primary)', fontWeight: 700 }}>
              {preset.analysis_id || preset.video_metadata?.filename || 'Real Video'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Movement Patterns & Directional Flow
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNavigate('zones')} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} />
            <span>Zone Analysis</span>
          </button>
          <button onClick={() => onNavigate('insights')} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>AI Spatial Insights</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Result Section Navigation Sub-Tabs */}
      <div className="app-tabs-nav" style={{ marginBottom: '2rem' }}>
        <button onClick={() => onNavigate('dashboard')} className="tab-btn">
          <Activity size={16} /> Overview
        </button>
        <button onClick={() => onNavigate('zones')} className="tab-btn">
          <Layers size={16} /> Zone Analysis
        </button>
        <button className="tab-btn active">
          <TrendingUp size={16} /> Movement Flow
        </button>
        <button onClick={() => onNavigate('insights')} className="tab-btn">
          <Sparkles size={16} /> AI Insights
        </button>
      </div>

      {/* Movement Insights Summary Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div className="kpi-card" style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Extracted Trajectories
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '4px' }}>
              {trajectories.length} paths
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--purple-primary)', fontWeight: 600 }}>
              Persistent ByteTrack vectors
            </span>
          </div>
          <Compass size={36} color="var(--purple-primary)" />
        </div>

        <div className="kpi-card" style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Circulation Velocity
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '4px' }}>
              Fluid Pace
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--mint-accent)', fontWeight: 700 }}>
              Optimal Unhindered Flow
            </span>
          </div>
          <Zap size={36} color="var(--mint-accent)" />
        </div>

        <div className="kpi-card" style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Circulation Status
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '4px' }}>
              {preset.traffic_analysis?.congestion_status || 'Fluid Flow'}
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--peach-accent)', fontWeight: 700 }}>
              Peak {preset.peak_occupancy || 0} Occupants
            </span>
          </div>
          <DoodleFootprints size={40} />
        </div>
      </div>

      {/* Flow Matrix Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                Zone Circulation Corridors
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Observed spatial transition vectors between active functional zones
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transitions.length > 0 ? transitions.map((t, idx) => (
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
            )) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Single-corridor trajectory movement recorded.
              </div>
            )}
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
                Movement velocity distribution across tracked anonymous occupants
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>
                  🎯 Stationary / High Dwell Occupants
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
                  🚶 Moderate Flow & Meandering
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
                  ⚡ Rapid Transit Corridors
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
