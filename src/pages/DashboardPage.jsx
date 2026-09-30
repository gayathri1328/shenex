import React, { useState } from 'react';
import { FloorplanViewer } from '../components/FloorplanViewer';
import { StatCard } from '../components/StatCard';
import { 
  DoodlePerson, 
  DoodleClock, 
  DoodleHeatmap, 
  DoodleZone, 
  DoodleBrain, 
  DoodleEye, 
  DoodleSparkle, 
  DoodleFootprints 
} from '../components/doodles/DoodleIndex';
import { 
  Users, 
  Clock, 
  Activity, 
  Layers, 
  TrendingUp, 
  Flame, 
  Compass, 
  Camera, 
  RotateCcw, 
  FileVideo, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';

export const DashboardPage = ({ 
  activeAnalysis, 
  onClearAnalysis, 
  onNavigate 
}) => {
  // If NO video has been analyzed, enforce the strict fresh empty state!
  if (!activeAnalysis) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          background: 'var(--cream-card)',
          border: '1.5px dashed var(--purple-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <DoodleEye size={84} color="var(--purple-primary)" accent="var(--mint-accent)" className="doodle-float" />
          </div>

          <span className="badge-pill badge-mint" style={{ marginBottom: '1rem' }}>
            Fresh Session • Ready for Video
          </span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '0.8rem' }}>
            Your space is waiting.
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Upload a 360° or indoor surveillance video to begin your first real-time occupancy and movement pattern analysis.
          </p>

          <button 
            onClick={() => onNavigate('upload')} 
            className="btn btn-primary btn-lg"
          >
            <Camera size={18} />
            <span>Upload Video</span>
          </button>
        </div>
      </div>
    );
  }

  // Active analysis results derived from REAL video data
  const meta = activeAnalysis.video_metadata || {};
  const dwell = activeAnalysis.dwell_time || {};
  const traffic = activeAnalysis.traffic_analysis || {};

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Top Header Bar */}
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
            <span className="badge-pill badge-mint">Real Video Analysis</span>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--purple-primary)', fontWeight: 700 }}>
              {activeAnalysis.analysis_id}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Spatial Intelligence Dashboard
          </h1>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={onClearAnalysis} 
            className="btn btn-secondary btn-sm"
            title="Clear active analysis from dashboard"
          >
            <RotateCcw size={14} />
            <span>New Analysis</span>
          </button>
          <button 
            onClick={() => onNavigate('upload')} 
            className="btn btn-primary btn-sm"
          >
            <Camera size={14} />
            <span>Upload Another Video</span>
          </button>
        </div>
      </div>

      {/* Real Video Metadata Strip */}
      <div style={{
        background: '#FAF7F2',
        border: '1.5px solid var(--lavender-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileVideo size={20} color="var(--purple-primary)" />
          <div>
            <strong style={{ color: 'var(--plum-deep)', display: 'block' }}>
              {meta.filename || 'Uploaded Video Stream'}
            </strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              {meta.width && meta.height ? `${meta.width}×${meta.height} px` : ''} • {meta.fps} FPS • {meta.total_frames} frames
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Duration</span>
            <strong>{meta.duration_formatted || `${meta.duration_seconds || 0}s`}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Processing Time</span>
            <strong>{activeAnalysis.processing_time_seconds || 0}s</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>CV Model</span>
            <span className="badge-pill badge-mint" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
              {activeAnalysis.model_information || 'Ultralytics YOLOv8n + ByteTrack'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="app-tabs-nav">
        <button className="tab-btn active">
          <Activity size={16} /> Overview
        </button>
        <button onClick={() => onNavigate('zones')} className="tab-btn">
          <Layers size={16} /> Zone Analysis
        </button>
        <button onClick={() => onNavigate('movement')} className="tab-btn">
          <Compass size={16} /> Movement Flow
        </button>
        <button onClick={() => onNavigate('insights')} className="tab-btn">
          <DoodleBrain size={18} /> AI Insights
        </button>
      </div>

      {/* Real Computed KPI Metrics Grid */}
      <div className="dashboard-grid">
        <StatCard
          label="Total People Tracked"
          value={activeAnalysis.total_unique_tracks}
          doodle={DoodlePerson}
          trend={activeAnalysis.total_unique_tracks > 0 ? "Real YOLO Tracks" : "0 Detections"}
          trendType={activeAnalysis.total_unique_tracks > 0 ? "positive" : "warning"}
          subtitle="Unique anonymous IDs detected"
        />
        <StatCard
          label="Peak Instant Occupancy"
          value={`${activeAnalysis.peak_occupancy} ppl`}
          doodle={DoodleHeatmap}
          trend={`Avg: ${activeAnalysis.average_occupancy} ppl`}
          trendType="neutral"
          subtitle="Max concurrent people in frame"
        />
        <StatCard
          label="Average Dwell Time"
          value={dwell.average_formatted || `${dwell.average_seconds || 0}s`}
          doodle={DoodleClock}
          trend={`Max: ${dwell.max_formatted || `${dwell.max_seconds || 0}s`}`}
          trendType="positive"
          subtitle="Computed temporal residency"
        />
        <StatCard
          label="Traffic Status"
          value={traffic.congestion_status || 'Fluid'}
          doodle={DoodleZone}
          trend={traffic.highest_traffic_zone ? `Top: ${traffic.highest_traffic_zone}` : 'Calculated'}
          trendType="positive"
          subtitle="Spatial circulation rating"
        />
      </div>

      {/* Real Floorplan & Density Heatmap Viewer */}
      <FloorplanViewer 
        preset={{
          title: meta.filename || 'Real Video Analysis',
          resolution: `${meta.width}x${meta.height}`,
          zones: activeAnalysis.zones || [],
          trajectories: activeAnalysis.trajectories || [],
          heatmapMatrix: activeAnalysis.heatmap || [],
        }} 
      />

      {/* Two Column Layout: Occupancy Timeline + Real Trajectories Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Occupancy Over Time Line Chart */}
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.8rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
                Real Occupancy Over Time
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Computed headcount across video timeline
              </p>
            </div>
            <span className="badge-pill badge-mint">Real CV Sample Points</span>
          </div>

          {activeAnalysis.occupancy_timeline && activeAnalysis.occupancy_timeline.length > 0 ? (
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaRealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C4AB6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6C4AB6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="30" y1={y} x2="98%" y2={y} stroke="rgba(108, 74, 182, 0.08)" strokeDasharray="3 3" />
                ))}

                {/* Area and Line */}
                {(() => {
                  const pointsList = activeAnalysis.occupancy_timeline;
                  const maxCount = Math.max(1, activeAnalysis.peak_occupancy || 1);
                  const polyCoords = pointsList.map((d, i) => {
                    const count = d.occupancy !== undefined ? d.occupancy : (d.count || 0);
                    const x = 30 + (i / Math.max(1, pointsList.length - 1)) * 420;
                    const y = 190 - (count / maxCount) * 150;
                    return `${x},${y}`;
                  });

                  return (
                    <>
                      <polygon
                        fill="url(#areaRealGrad)"
                        points={`30,190 ${polyCoords.join(' ')} 450,190`}
                      />
                      <polyline
                        fill="none"
                        stroke="var(--purple-primary)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={polyCoords.join(' ')}
                      />
                      {pointsList.map((d, i) => {
                        const count = d.occupancy !== undefined ? d.occupancy : (d.count || 0);
                        const x = 30 + (i / Math.max(1, pointsList.length - 1)) * 420;
                        const y = 190 - (count / maxCount) * 150;
                        return (
                          <g key={d.timestamp !== undefined ? `pt-${d.timestamp}` : i}>
                            <circle cx={x} cy={y} r="4" fill="#FFFFFF" stroke="var(--purple-primary)" strokeWidth="2.5" />
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No occupancy data points found.
            </div>
          )}
        </div>

        {/* Real Anonymous Trajectories List */}
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.8rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
                Tracked Anonymous People ({activeAnalysis.trajectories?.length || 0})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ByteTrack IDs & Dwell Durations
              </p>
            </div>
            <button onClick={() => onNavigate('movement')} className="btn btn-secondary btn-sm">
              Flow Vectors
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', maxHeight: '240px' }}>
            {(!activeAnalysis.trajectories || activeAnalysis.trajectories.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                Zero people detected in this video.
              </div>
            ) : (
              activeAnalysis.trajectories.map((traj, idx) => (
                <div
                  key={traj.track_id || traj.id || `traj-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#FAF7F2',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--lavender-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: traj.color,
                        boxShadow: `0 0 8px ${traj.color}`,
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--plum-deep)' }}>
                        {traj.label} ({traj.id})
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {traj.points.length} tracked waypoints • {traj.entry_time}s to {traj.exit_time}s
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge-pill badge-mint" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      Dwell: {traj.dwell_formatted}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
