import React, { useState } from 'react';
import { 
  DoodleBrain, 
  DoodleSparkle, 
  DoodleZone, 
  DoodleHeatmap, 
  DoodleClock 
} from '../components/doodles/DoodleIndex';
import { 
  Sparkles, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Activity,
  Compass,
  Copy,
  Check,
  TrendingUp,
  BarChart3,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InsightsPage = ({ currentPreset, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  // Empty State if no video has been analyzed
  if (!currentPreset || !currentPreset.insights || currentPreset.insights.length === 0) {
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
            <DoodleBrain size={76} color="var(--purple-primary)" />
          </div>
          <span className="badge-pill badge-mint" style={{ marginBottom: '0.8rem' }}>
            Autonomous Spatial Reasoning
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '0.5rem', marginBottom: '0.8rem' }}>
            No video analyzed yet.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: '0 auto 2.2rem', maxWidth: '420px' }}>
            AI insights will appear after sufficient movement data is available from an uploaded surveillance video.
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

  const meta = currentPreset.video_metadata || {};
  const dwell = currentPreset.dwell_time || {};
  const traffic = currentPreset.traffic_analysis || {};
  const zones = currentPreset.zones || [];
  const insights = currentPreset.insights || [];
  const peakOcc = currentPreset.peak_occupancy || 0;
  const avgOcc = currentPreset.average_occupancy || 0;
  const totalTracks = currentPreset.total_unique_tracks || 0;
  const congestion = traffic.congestion_status || (peakOcc < 5 ? 'Fluid' : peakOcc < 12 ? 'Moderate' : 'High Congestion');

  const handleExportReport = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6C4AB6', '#4ECCA3', '#FF8C69', '#8D68DC']
      });
    } catch {
      // safe fallback
    }

    const reportData = {
      platform: 'SHENEX Spatial Intelligence',
      analysis_id: currentPreset.analysis_id || 'AN_EXPORT',
      generated_at: new Date().toISOString(),
      video_metadata: meta,
      metrics: {
        total_unique_tracks: totalTracks,
        peak_occupancy: peakOcc,
        average_occupancy: avgOcc,
        dwell_time: dwell,
      },
      traffic_analysis: traffic,
      zones: zones,
      insights: insights,
      model_information: currentPreset.model_information || 'Ultralytics YOLOv8n + ByteTrack',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHENEX_Report_${currentPreset.analysis_id || Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleCopySummary = () => {
    const text = `SHENEX SPATIAL INTELLIGENCE REPORT
Analysis ID: ${currentPreset.analysis_id || 'N/A'}
Peak Occupancy: ${peakOcc} occupants
Average Occupancy: ${avgOcc} occupants
Total Tracked People: ${totalTracks}
Average Dwell Time: ${dwell.average_formatted || `${dwell.average_seconds || 0}s`}
Primary Traffic Hub: ${traffic.highest_traffic_zone || 'None'}
Circulation Health: ${congestion}
Key Insight: ${insights[0]?.title || 'Standard circulation observed.'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
            <span className="badge-pill badge-mint">Autonomous Spatial Reasoning</span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--purple-primary)', fontWeight: 700 }}>
              {currentPreset.analysis_id || meta.filename || 'Real Video'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            AI Spatial Insights & Observations
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCopySummary} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {copied ? <Check size={14} color="var(--mint-accent)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Brief!' : 'Copy Summary'}</span>
          </button>
          <button onClick={handleExportReport} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} />
            <span>{exported ? 'Report Exported!' : 'Export JSON Report'}</span>
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
        <button onClick={() => onNavigate('movement')} className="tab-btn">
          <TrendingUp size={16} /> Movement Flow
        </button>
        <button className="tab-btn active">
          <Sparkles size={16} /> AI Insights
        </button>
      </div>

      {/* Executive Summary Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--plum-deep) 0%, var(--purple-primary) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 3rem',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
      }}>
        <div>
          <span className="badge-pill badge-mint" style={{ marginBottom: '0.8rem' }}>
            Executive Synthesis
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.8rem' }}>
            Spatial Health Assessment: {congestion} Flow
          </h2>
          <p style={{ color: '#E8DCFC', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
            {traffic.explanation || `Observed ${totalTracks} unique anonymous occupants. Peak density reached ${peakOcc} occupants with an average dwell of ${dwell.average_formatted || `${dwell.average_seconds || 0}s`}.`}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', fontSize: '0.82rem', color: '#D8C5F8' }}>
            <span>✓ {zones.length} Zones Analyzed</span>
            <span>✓ {currentPreset.trajectories ? currentPreset.trajectories.length : totalTracks} Tracked Trajectories</span>
            <span>✓ 100% Anonymous Centroid Tracking</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.8rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <DoodleBrain size={56} color="#FFFFFF" accent="#4ECCA3" />
          <h4 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.1rem' }}>
            Continuous Spatial Intelligence
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#C8BBD6', marginTop: '4px' }}>
            Automated reasoning over real ByteTrack tracking vectors and spatial density
          </span>
        </div>
      </div>

      {/* Actionable Observation Cards */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '1.2rem' }}>
        Key Observations & Spatial Reasoning
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
        {insights.map((ins, index) => {
          const type = ins.type || 'traffic';
          const isAlert = type === 'alert';
          const isOpp = type === 'opportunity';

          return (
            <div
              key={ins.id || `ins-${index}`}
              className={`insight-card ${isAlert ? 'alert' : isOpp ? 'opportunity' : 'traffic'}`}
              style={{
                background: 'var(--cream-card)',
                border: '1.5px solid var(--lavender-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.4rem 1.6rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: isAlert ? '#FFF0EB' : isOpp ? '#E4F8F1' : 'var(--lavender-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isAlert ? (
                  <AlertTriangle size={22} color="var(--peach-accent)" />
                ) : isOpp ? (
                  <Sparkles size={22} color="var(--mint-accent)" />
                ) : (
                  <Activity size={22} color="var(--purple-primary)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                    {ins.title || 'Spatial Observation'}
                  </h4>
                  {ins.impact && (
                    <span className={`badge-pill ${isAlert ? 'badge-peach' : 'badge-mint'}`} style={{ fontSize: '0.72rem' }}>
                      {ins.impact}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {ins.description || 'Observed movement pattern within expected circulation thresholds.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
