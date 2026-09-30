import React, { useState } from 'react';
import { 
  DoodleZone, 
  DoodleClock, 
  DoodleSparkle, 
  DoodleHeatmap 
} from '../components/doodles/DoodleIndex';
import { 
  Layers, 
  Clock, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  BarChart3,
  Camera
} from 'lucide-react';

export const ZoneAnalysisPage = ({ currentPreset, onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);

  // Robust Empty State when no video has been analyzed
  if (!currentPreset || !currentPreset.zones || currentPreset.zones.length === 0) {
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
            <DoodleZone size={76} color="var(--purple-primary)" />
          </div>
          <span className="badge-pill badge-mint" style={{ marginBottom: '0.8rem' }}>
            Zone Segmentation Module
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '0.5rem', marginBottom: '0.8rem' }}>
            No video analyzed yet.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 2.2rem', maxWidth: '420px' }}>
            Upload a surveillance video to generate zone analytics, segment space into quadrants, and measure traffic density.
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

  const zones = currentPreset.zones || [];
  const meta = currentPreset.video_metadata || {};
  const traffic = currentPreset.traffic_analysis || {};
  const totalTracks = currentPreset.total_unique_tracks || 1;

  const filteredZones = zones.filter((z) => {
    const status = (z.status || '').toLowerCase();
    if (filter === 'high') return status.includes('high');
    if (filter === 'low') return status.includes('low') || status.includes('zero');
    return true;
  });

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
            <span className="badge-pill badge-mint">Spatial Segmentation</span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--purple-primary)', fontWeight: 700 }}>
              {currentPreset.analysis_id || meta.filename || 'Real Video'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Indoor Zone & Traffic Analysis
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary btn-sm">
            <BarChart3 size={14} />
            <span>Overview</span>
          </button>
          <button onClick={() => onNavigate('movement')} className="btn btn-primary btn-sm">
            <span>Movement Flow</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Result Section Navigation Sub-Tabs */}
      <div className="app-tabs-nav" style={{ marginBottom: '2rem' }}>
        <button onClick={() => onNavigate('dashboard')} className="tab-btn">
          <Activity size={16} /> Overview
        </button>
        <button className="tab-btn active">
          <Layers size={16} /> Zone Analysis
        </button>
        <button onClick={() => onNavigate('movement')} className="tab-btn">
          <TrendingUp size={16} /> Movement Flow
        </button>
        <button onClick={() => onNavigate('insights')} className="tab-btn">
          <Sparkles size={16} /> AI Insights
        </button>
      </div>

      {/* Traffic Summary Cards Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.2rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Primary Circulation Hub
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '4px' }}>
            {traffic.highest_traffic_zone || 'Zone A'}
          </h3>
          <span className="badge-pill badge-peach" style={{ marginTop: '8px' }}>
            Top Traffic Concentration
          </span>
        </div>

        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Underutilized Area
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '4px' }}>
            {traffic.lowest_traffic_zone || 'None'}
          </h3>
          <span className="badge-pill badge-mint" style={{ marginTop: '8px' }}>
            Low Circulation Area
          </span>
        </div>

        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Circulation Health
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '4px' }}>
            {traffic.congestion_status || 'Fluid Flow'}
          </h3>
          <span className="badge-pill" style={{ marginTop: '8px', background: 'var(--lavender-soft)', color: 'var(--purple-primary)' }}>
            Peak: {currentPreset.peak_occupancy || 0} occupants
          </span>
        </div>
      </div>

      {/* Filter Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
            Filter Zones:
          </span>
          <div className="toggle-group">
            <button
              onClick={() => setFilter('all')}
              className={`toggle-item ${filter === 'all' ? 'active' : ''}`}
            >
              All Zones ({zones.length})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`toggle-item ${filter === 'high' ? 'active' : ''}`}
            >
              🔥 High Traffic
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`toggle-item ${filter === 'low' ? 'active' : ''}`}
            >
              ❄️ Low / Quiet
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredZones.length}</strong> of {zones.length} analyzed zones
        </div>
      </div>

      {/* Real Zones Table Card */}
      <div className="zones-table-card" style={{
        background: 'var(--cream-card)',
        border: '1.5px solid var(--lavender-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2.5rem',
      }}>
        <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--lavender-card)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 1.2rem' }}>Zone Name</th>
              <th style={{ padding: '1rem 1.2rem' }}>Coordinates</th>
              <th style={{ padding: '1rem 1.2rem' }}>Avg Dwell</th>
              <th style={{ padding: '1rem 1.2rem' }}>Unique Visitors</th>
              <th style={{ padding: '1rem 1.2rem' }}>Spatial Density</th>
              <th style={{ padding: '1rem 1.2rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((z) => {
              const isSelected = selectedZone?.id === z.id;
              const isHighTraffic = (z.status || '').toLowerCase().includes('high');
              const isLowTraffic = (z.status || '').toLowerCase().includes('low') || (z.status || '').toLowerCase().includes('zero');
              const densityPct = z.density_pct !== undefined ? z.density_pct : Math.round(((z.visitors || 0) / totalTracks) * 100);

              return (
                <tr
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'var(--lavender-soft)' : 'transparent',
                    borderTop: '1px solid var(--lavender-border)',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '4px',
                          background: z.color || 'var(--purple-primary)',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <strong style={{ color: 'var(--plum-deep)', fontSize: '0.95rem' }}>
                        {z.name}
                      </strong>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      [{z.x}%, {z.y}%] • {z.width}×{z.height}%
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--purple-primary)" />
                      <strong style={{ color: 'var(--plum-deep)' }}>
                        {z.dwellAvg_formatted || `${z.dwellAvg || 0}s`}
                      </strong>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>
                      {z.visitors || 0} people
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '70px',
                        height: '7px',
                        background: 'var(--lavender-border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div
                          style={{
                            width: `${Math.min(100, densityPct)}%`,
                            height: '100%',
                            background: z.color || 'var(--purple-primary)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {densityPct}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span className={`badge-pill ${isHighTraffic ? 'badge-peach' : isLowTraffic ? '' : 'badge-mint'}`}>
                      {z.status || 'Active Flow'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Comparative Dwell Time Visualizer */}
      <div style={{
        background: 'var(--cream-card)',
        border: '1.5px solid var(--lavender-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--lavender-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DoodleClock size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
              Zone Dwell Time Comparison
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Calculated via real ByteTrack trajectory occupancy within zone bounding boundaries
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {zones.map((z) => {
            const allDwells = zones.map(item => item.dwellAvg || 0);
            const maxDwell = Math.max(1, ...allDwells);
            const pct = Math.min(100, ((z.dwellAvg || 0) / maxDwell) * 100);

            return (
              <div key={z.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>{z.name}</span>
                  <span style={{ fontWeight: 800, color: z.color || 'var(--purple-primary)' }}>
                    {z.dwellAvg_formatted || `${z.dwellAvg || 0}s`}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: 'var(--lavender-card)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: z.color || 'linear-gradient(90deg, var(--purple-primary), var(--peach-accent))',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
