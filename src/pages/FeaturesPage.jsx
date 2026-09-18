import React, { useState } from 'react';
import { 
  DoodlePerson, 
  DoodleHeatmap, 
  DoodleFootprints, 
  DoodleClock, 
  DoodleZone, 
  DoodleBrain, 
  DoodleSparkle, 
  DoodleRadar 
} from '../components/doodles/DoodleIndex';
import { ArrowRight, Check, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export const FeaturesPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 'occupancy',
      doodle: DoodlePerson,
      title: 'Occupancy Intelligence',
      subtitle: 'Real-time spatial headcounts without biometric identification',
      description: 'Accurately quantifies the number of individuals present across an entire indoor footprint at any given millisecond. Automatically tracks peak saturation hours, capacity thresholds, and spatial utilization rates.',
      metrics: ['Instant Headcount Count', 'Peak Saturation Detection', 'Capacity Compliance Alerting', 'Historical Volume Trends'],
      visualType: 'counter',
    },
    {
      id: 'heatmaps',
      doodle: DoodleHeatmap,
      title: 'Spatial Heatmaps',
      subtitle: '2D Gaussian Kernel Density Estimation on unwrapped floorplans',
      description: 'Projects spherical fisheye pixel coordinates onto a planar 2D architectural map, superimposing a smooth, continuous heat gradient that reveals where people congregate and spend physical time.',
      metrics: ['Gaussian KDE Smoothing', 'Custom Color Palettes', 'Multi-Floor Aggregation', 'Temporal Time-Slicing'],
      visualType: 'heatmap',
    },
    {
      id: 'movement',
      doodle: DoodleFootprints,
      title: 'Movement Patterns',
      subtitle: 'Trajectory vectors, directional vectors & path finding',
      description: 'Extracts motion vectors across sequential frames to understand circulation corridors. Identifies natural walking shortcuts, common entrance-to-destination pathways, and counter-flow congestion.',
      metrics: ['Trajectory Reconstruction', 'Directional Vector Fields', 'Transit Speed Profiling', 'Convergence Point Mapping'],
      visualType: 'vector',
    },
    {
      id: 'dwell',
      doodle: DoodleClock,
      title: 'Dwell Time Estimation',
      subtitle: 'Precise measurement of physical presence duration',
      description: 'Calculates the exact temporal duration each anonymous track remains within specific bounding zones. Distinguishes fast transit corridors from meaningful lingering and contemplation zones.',
      metrics: ['Zone Dwell Duration', 'Bounce vs Engagement Ratio', 'Average Dwell by Area', 'Queue & Waiting Estimation'],
      visualType: 'dwell',
    },
    {
      id: 'traffic',
      doodle: DoodleZone,
      title: 'Traffic Zones',
      subtitle: 'Automated categorization of indoor thoroughfares',
      description: 'Classifies designated functional spaces into High-Traffic, Moderate-Traffic, and Cold Dead-Zones. Enables facility managers to rebalance foot-traffic distribution and eliminate spatial bottlenecks.',
      metrics: ['Polygon Zone Definition', 'Turnover Velocity Index', 'Dead Zone Identification', 'Dynamic Congestion Index'],
      visualType: 'zones',
    },
    {
      id: 'insights',
      doodle: DoodleBrain,
      title: 'AI Spatial Insights',
      subtitle: 'Turning CV coordinates into plain-English design actions',
      description: 'Synthesizes mathematical CV detections into actionable architectural suggestions. Highlights where physical pathways are too narrow, where queue congestion occurs, and where signage is missing.',
      metrics: ['Bottleneck Prediction', 'Layout Optimization Suggestions', 'Automated Executive Briefs', 'PDF & JSON Export'],
      visualType: 'insights',
    },
  ];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div className="section-header-center">
        <span className="badge-pill">
          <DoodleSparkle size={18} color="var(--purple-primary)" />
          <span>Core Capabilities</span>
        </span>
        <h1 className="section-title">Built for Complex Indoor Environments</h1>
        <p className="section-lead">
          Six foundational pillars addressing Hackathon Problem PR-02 with elegance, algorithmic rigor, and delightful design.
        </p>
      </div>

      {/* Feature Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '0.6rem' }}>
        {features.map((feat, idx) => {
          const DoodleIcon = feat.doodle;
          return (
            <button
              key={feat.id}
              onClick={() => setActiveTab(idx)}
              className={`tab-btn ${activeTab === idx ? 'active' : ''}`}
            >
              <DoodleIcon size={20} color={activeTab === idx ? '#FFFFFF' : 'var(--purple-primary)'} />
              <span>{feat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Feature Deep Dive Showcase */}
      <div style={{
        background: 'var(--cream-card)',
        border: '1.5px solid var(--lavender-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '3rem',
        alignItems: 'center',
        marginBottom: '4rem',
      }}>
        {/* Left Explanation */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--lavender-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {React.createElement(features[activeTab].doodle, { size: 40 })}
            </div>
            <div>
              <span className="badge-pill badge-mint" style={{ fontSize: '0.72rem' }}>
                Feature Pillar #{activeTab + 1}
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--plum-deep)', fontWeight: 800 }}>
                {features[activeTab].title}
              </h2>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', color: 'var(--purple-primary)', fontWeight: 600, marginBottom: '1.2rem' }}>
            {features[activeTab].subtitle}
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            {features[activeTab].description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
            {features[activeTab].metrics.map((metric, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--plum-deep)' }}>
                <Check size={16} color="var(--mint-accent)" strokeWidth={3} />
                <span>{metric}</span>
              </div>
            ))}
          </div>

          <button onClick={() => onNavigate('dashboard')} className="btn btn-primary">
            <span>Explore on Live Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Interactive Mock Viewport */}
        <div style={{
          background: '#FAF7F2',
          border: '1.5px dashed var(--purple-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <span className="badge-pill badge-peach">Live Preview</span>
          </div>

          {activeTab === 0 && (
            <div style={{ textAlign: 'center' }}>
              <DoodlePerson size={90} />
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
                42 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Occupants</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--mint-accent)', fontWeight: 700 }}>
                Capacity Status: Normal (64% of max 65)
              </p>
            </div>
          )}

          {activeTab === 1 && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <DoodleHeatmap size={90} />
              <p style={{ marginTop: '1rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                High-Density Zone: Espresso Island
              </p>
              <div style={{
                height: '14px',
                width: '80%',
                margin: '12px auto',
                borderRadius: '8px',
                background: 'linear-gradient(to right, #4ECCA3, #F59E0B, #FF5252)',
              }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cold (Low Presence) → Hot (Heavy Linger)</span>
            </div>
          )}

          {activeTab === 2 && (
            <div style={{ textAlign: 'center' }}>
              <DoodleFootprints size={90} />
              <div style={{ marginTop: '1rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                Primary Corridor: Reception → Flex Desks
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--purple-primary)', fontWeight: 600 }}>
                Average Walking Speed: 1.1 m/s (Direct Transit)
              </span>
            </div>
          )}

          {activeTab === 3 && (
            <div style={{ textAlign: 'center' }}>
              <DoodleClock size={90} />
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
                18.4 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Minutes</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Median Dwell across 284 identified visits
              </p>
            </div>
          )}

          {activeTab === 4 && (
            <div style={{ textAlign: 'center' }}>
              <DoodleZone size={90} />
              <div style={{ marginTop: '1rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                5 Active Architectural Zones Defined
              </div>
              <span className="badge-pill badge-mint" style={{ marginTop: '8px' }}>
                Congestion Index: 34% (Healthy Flow)
              </span>
            </div>
          )}

          {activeTab === 5 && (
            <div style={{ textAlign: 'center' }}>
              <DoodleBrain size={90} />
              <div style={{ marginTop: '1rem', fontWeight: 700, color: 'var(--plum-deep)' }}>
                Spatial Suggestion Generated
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '8px auto 0' }}>
                "Expand coffee queue buffer by 1.2 meters to prevent cross-traffic interference with main entryway."
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
