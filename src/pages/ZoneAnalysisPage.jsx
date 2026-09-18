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
  Plus, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export const ZoneAnalysisPage = ({ currentPreset, onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);

  if (!currentPreset || !currentPreset.zones) {
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
          <DoodleZone size={72} color="var(--purple-primary)" />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
            No Zone Analysis Active
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.8rem 0 2rem' }}>
            Upload a video to segment spatial areas, measure dwell times, and track occupancy flow.
          </p>
          <button onClick={() => onNavigate('upload')} className="btn btn-primary btn-lg">
            Upload Video
          </button>
        </div>
      </div>
    );
  }

  const preset = currentPreset;
  const filteredZones = preset.zones.filter((z) => {
    if (filter === 'high') return z.status.toLowerCase().includes('high');
    if (filter === 'low') return z.status.toLowerCase().includes('low');
    return true;
  });

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
            <span className="badge-pill badge-mint">Spatial Segmentation</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dataset: <strong>{preset.title}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Indoor Zone & Traffic Analysis
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary btn-sm">
            Dashboard View
          </button>
          <button onClick={() => onNavigate('movement')} className="btn btn-primary btn-sm">
            Movement Flow <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="app-tabs-nav">
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
          <DoodleSparkle size={16} /> AI Insights
        </button>
      </div>

      {/* Filter and Overview Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Filter Zones:
          </span>
          <div className="toggle-group">
            <button
              onClick={() => setFilter('all')}
              className={`toggle-item ${filter === 'all' ? 'active' : ''}`}
            >
              All Zones ({preset.zones.length})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`toggle-item ${filter === 'high' ? 'active' : ''}`}
            >
              🔥 High Traffic / Dwell
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`toggle-item ${filter === 'low' ? 'active' : ''}`}
            >
              ❄️ Low Traffic / Quiet
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredZones.length}</strong> of {preset.zones.length} configured zones
        </div>
      </div>

      {/* Zones Table Card */}
      <div className="zones-table-card" style={{ marginBottom: '2.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Bounding Geometry</th>
              <th>Avg Dwell Time</th>
              <th>Total Unique Visitors</th>
              <th>Circulation Status</th>
              <th>Turnover Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((z) => {
              const isSelected = selectedZone?.id === z.id;
              const isHighTraffic = z.status.toLowerCase().includes('high');
              const isLowTraffic = z.status.toLowerCase().includes('low');

              return (
                <tr
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? '#F4EFFE' : 'transparent',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '4px',
                          background: z.color || 'var(--purple-primary)',
                          display: 'inline-block',
                        }}
                      />
                      <strong style={{ color: 'var(--plum-deep)', fontSize: '0.95rem' }}>
                        {z.name}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      [{z.x}%, {z.y}%] • {z.width}×{z.height}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="var(--purple-primary)" />
                      <strong style={{ color: 'var(--plum-deep)' }}>{z.dwellAvg} min</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>
                      {z.visitors} ppl
                    </span>
                  </td>
                  <td>
                    <span className={`badge-pill ${isHighTraffic ? 'badge-peach' : isLowTraffic ? '' : 'badge-mint'}`}>
                      {z.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '70px',
                        height: '6px',
                        background: 'var(--lavender-border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div
                          style={{
                            width: `${Math.min(100, (z.visitors / 350) * 100)}%`,
                            height: '100%',
                            background: z.color || 'var(--purple-primary)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {((z.visitors / preset.stats.totalVisitors) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Comparative Dwell Time Bar Analysis */}
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
              Zone Dwell Time Comparison (Minutes)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Calculated via cumulative spatial residency integral ∫(P_zone · dt)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {preset.zones.map((z) => {
            const maxDwell = Math.max(...preset.zones.map(item => item.dwellAvg));
            const pct = (z.dwellAvg / maxDwell) * 100;

            return (
              <div key={z.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--plum-deep)' }}>{z.name}</span>
                  <span style={{ fontWeight: 800, color: z.color || 'var(--purple-primary)' }}>
                    {z.dwellAvg} mins
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#F4EFFE',
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
