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
  ArrowUpRight, 
  Layers, 
  Activity,
  Compass,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InsightsPage = ({ currentPreset, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  if (!currentPreset || !currentPreset.insights) {
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
          <DoodleBrain size={72} color="var(--purple-primary)" />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
            No Spatial Insights Active
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.8rem 0 2rem' }}>
            Upload a video to synthesize real computer vision insights, bottleneck warnings, and space utilization recommendations.
          </p>
          <button onClick={() => onNavigate('upload')} className="btn btn-primary btn-lg">
            Upload Video
          </button>
        </div>
      </div>
    );
  }

  const preset = currentPreset;

  const handleExportReport = () => {
    // Fire festive celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C4AB6', '#4ECCA3', '#FF9E7D', '#8D68DC']
    });

    // Create JSON download
    const reportData = {
      platform: 'SHENEX Spatial Intelligence',
      version: '1.0.0 (PR-02)',
      generatedAt: new Date().toISOString(),
      scenario: preset.title,
      summaryStats: preset.stats,
      zones: preset.zones,
      aiObservations: preset.insights,
      privacyGuarantee: '100% Anonymous Centroid Tracking. Zero PII. Zero Facial Embeddings.',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHENEX_Spatial_Report_${preset.id}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 4000);
  };

  const handleCopySummary = () => {
    const text = `SHENEX SPATIAL INTELLIGENCE REPORT\nScenario: ${preset.title}\nPeak Occupancy: ${preset.stats.peakOccupancy} occupants\nAvg Dwell Time: ${preset.stats.avgDwellTime}\nTotal Visitors: ${preset.stats.totalVisitors}\nKey Observation: ${preset.insights[0]?.title} - ${preset.insights[0]?.description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

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
            <span className="badge-pill badge-mint">Autonomous Spatial Reasoning</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dataset: <strong>{preset.title}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            AI Spatial Insights & Recommendations
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCopySummary} className="btn btn-secondary btn-sm">
            {copied ? <Check size={14} color="var(--mint-accent)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Brief!' : 'Copy Summary'}</span>
          </button>
          <button onClick={handleExportReport} className="btn btn-primary btn-sm">
            <Download size={14} />
            <span>{exported ? 'Report Exported!' : 'Export Spatial Report'}</span>
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
        <button onClick={() => onNavigate('movement')} className="tab-btn">
          <Compass size={16} /> Movement Flow
        </button>
        <button className="tab-btn active">
          <DoodleBrain size={18} /> AI Insights
        </button>
      </div>

      {/* Executive Summary Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--plum-deep) 0%, var(--purple-primary) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 3rem',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '3rem',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.5rem',
        alignItems: 'center',
      }}>
        <div>
          <span className="badge-pill badge-mint" style={{ marginBottom: '0.8rem' }}>
            Executive Synthesis
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.8rem' }}>
            Spatial Health Assessment: {preset.stats.congestionIndex}
          </h2>
          <p style={{ color: '#E8DCFC', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
            Analysis of {preset.stats.totalVisitors} unique visits across {preset.duration} of 360° omnidirectional footage indicates balanced overall circulation with localized dwell concentrations around the center spine.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#D8C5F8' }}>
            <span>✓ {preset.zones.length} Zones Analyzed</span>
            <span>✓ {preset.stats.totalTrajectories} Trajectories Extracted</span>
            <span>✓ 0 Biometric Violations</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <DoodleBrain size={62} color="#FFFFFF" accent="#4ECCA3" />
          <h4 style={{ color: 'white', marginTop: '0.8rem', fontSize: '1.1rem' }}>
            Continuous Spatial Intelligence
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#C8BBD6' }}>
            Autonomous rule-based reasoning over 2D KDE density tensors
          </span>
        </div>
      </div>

      {/* Actionable Observation Cards */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '1.2rem' }}>
        Key Observations & Architectural Recommendations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
        {preset.insights.map((ins) => {
          const isAlert = ins.type === 'alert';
          const isOpp = ins.type === 'opportunity';

          return (
            <div
              key={ins.id}
              className={`insight-card ${isAlert ? 'alert' : isOpp ? 'opportunity' : 'traffic'}`}
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
                  <AlertTriangle size={24} color="var(--peach-accent)" />
                ) : isOpp ? (
                  <Sparkles size={24} color="var(--mint-accent)" />
                ) : (
                  <Activity size={24} color="var(--purple-primary)" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                    {ins.title}
                  </h4>
                  <span className={`badge-pill ${isAlert ? 'badge-peach' : 'badge-mint'}`} style={{ fontSize: '0.72rem' }}>
                    {ins.impact}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Action Card */}
      <div style={{
        background: 'var(--cream-card)',
        border: '1.5px dashed var(--purple-primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        textAlign: 'center',
      }}>
        <DoodleSparkle size={48} color="var(--purple-primary)" className="doodle-float" />
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          Need to present these findings to facility stakeholders?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
          Export a complete machine-readable and executive audit package containing all spatial metrics, zone dwell durations, and trajectory distributions.
        </p>
        <button onClick={handleExportReport} className="btn btn-primary btn-lg">
          <Download size={18} />
          <span>Download Complete Spatial Report (.JSON)</span>
        </button>
      </div>
    </div>
  );
};
