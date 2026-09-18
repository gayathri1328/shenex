import React from 'react';
import { 
  DoodleCamera, 
  DoodleCCTV, 
  DoodlePerson, 
  DoodleRadar, 
  DoodleClock, 
  DoodleHeatmap, 
  DoodleBrain, 
  DoodleArrow, 
  DoodleZone,
  DoodleFootprints,
  DoodleSparkle 
} from '../components/doodles/DoodleIndex';
import { Layers, ShieldCheck, Cpu, Code2, ArrowRight } from 'lucide-react';

export const HowItWorksPage = ({ onNavigate }) => {
  const steps = [
    {
      step: 1,
      name: 'UPLOAD',
      tag: 'Video Preprocessing',
      headline: 'Provide a 360° indoor video.',
      description: 'The platform ingests high-resolution 360° panoramic or fisheye ceiling surveillance video. Using spherical equirectangular unwrapping and planar camera calibration, spherical distortions are converted into bird’s-eye ground plane projections.',
      doodle: DoodleCamera,
      tech: 'Equirectangular Projection • OpenCV Fisheye Rectification • Frame Sampling',
    },
    {
      step: 2,
      name: 'DETECT',
      tag: 'Person Detection',
      headline: 'Detect people in the video.',
      description: 'A dedicated convolutional person detector (YOLO / MobileNet) scans unwrapped perspective crops. Detections are strictly filtered to class 0 (Person), ensuring zero facial recognition, zero identity estimation, and zero demographic inference.',
      doodle: DoodlePerson,
      tech: 'Confidence Threshold ≥ 0.5 • Centroid Contact Estimation • Anonymization Layer',
    },
    {
      step: 3,
      name: 'TRACK',
      tag: 'Multi-Object Tracking',
      headline: 'Track movement across frames.',
      description: 'Persistent multi-object tracking (ByteTrack / Kalman Centroid Tracker) links detections across consecutive frames even through short occlusions and overlapping paths, maintaining temporary anonymous tracking IDs (e.g., #001, #002).',
      doodle: DoodleRadar,
      tech: 'Kalman State Estimation • Hungarian IoU Matching • Trajectory Smoothing',
    },
    {
      step: 4,
      name: 'ANALYZE',
      tag: 'Occupancy & Dwell Math',
      headline: 'Calculate occupancy, trajectories and dwell time.',
      description: 'Each person’s ground contact coordinate is mapped to user-defined polygon zones. The system computes temporal dwell time integrals: Dwell = ∑ (t_in_zone · Δt), along with velocity profiles and occupancy headcounts over time.',
      doodle: DoodleClock,
      tech: 'Point-in-Polygon (Ray Casting) • Dwell Integral Computation • Peak Time Clustering',
    },
    {
      step: 5,
      name: 'VISUALIZE',
      tag: 'Heatmaps & Traffic Flow',
      headline: 'Generate heatmaps, traffic zones and movement patterns.',
      description: 'Spatial density is synthesized using 2D Gaussian Kernel Density Estimation (KDE) onto the architectural floorplan. High-traffic thoroughfares and low-traffic dead zones are highlighted with custom gradient scales and trajectory arrows.',
      doodle: DoodleHeatmap,
      tech: 'Gaussian KDE Surface • Vector Flow Fields • Dynamic Layer Compositing',
    },
    {
      step: 6,
      name: 'INSIGHT',
      tag: 'Spatial Intelligence',
      headline: 'Turn analytics into understandable observations.',
      description: 'The engine converts numeric spatial metrics into plain-English behavioral observations and architectural recommendations. It identifies queue bottlenecks, underutilized areas, and suggestions for optimized furniture or walkway layouts.',
      doodle: DoodleBrain,
      tech: 'Rule-Based Spatial Reasoning • Bottleneck Classification • PDF / JSON Export',
    },
  ];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div className="section-header-center">
        <span className="badge-pill badge-mint">
          <DoodleSparkle size={18} color="var(--mint-accent)" />
          <span>Computer Vision Architecture</span>
        </span>
        <h1 className="section-title">How SHENEX Works</h1>
        <p className="section-lead">
          From 360° omnidirectional surveillance video to actionable spatial intelligence in 6 modular stages.
        </p>
      </div>

      {/* Visual Pipeline Banner */}
      <div style={{
        background: 'var(--lavender-soft)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 2rem',
        marginBottom: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.88rem',
        fontWeight: 700,
        color: 'var(--plum-deep)',
        border: '1.5px solid var(--lavender-border)',
      }}>
        <span>VIDEO</span>
        <DoodleArrow size={24} color="var(--purple-primary)" />
        <span>DETECTION</span>
        <DoodleArrow size={24} color="var(--purple-primary)" />
        <span>TRACKING</span>
        <DoodleArrow size={24} color="var(--purple-primary)" />
        <span>OCCUPANCY</span>
        <DoodleArrow size={24} color="var(--purple-primary)" />
        <span>SPATIAL ANALYSIS</span>
        <DoodleArrow size={24} color="var(--purple-primary)" />
        <span>INSIGHTS</span>
      </div>

      {/* Pipeline Steps Flow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px', margin: '0 auto' }}>
        {steps.map((item, index) => {
          const DoodleIcon = item.doodle;
          return (
            <div key={item.step} style={{ position: 'relative' }}>
              <div style={{
                background: 'var(--cream-card)',
                border: '1.5px solid var(--lavender-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.4rem',
                boxShadow: 'var(--shadow-md)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '2rem',
                alignItems: 'flex-start',
                position: 'relative',
              }}>
                {/* Left Step Circle & Doodle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'var(--lavender-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <DoodleIcon size={42} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: 'var(--plum-deep)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    Step 0{item.step}
                  </span>
                </div>

                {/* Right Description */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="badge-pill" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      {item.tag}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--plum-deep)', fontWeight: 800 }}>
                      {item.headline}
                    </h3>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                    {item.description}
                  </p>

                  <div style={{
                    background: '#FAF7F2',
                    border: '1px solid var(--lavender-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    color: 'var(--purple-primary)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <Code2 size={14} />
                    <span>Algorithms: {item.tech}</span>
                  </div>
                </div>
              </div>

              {/* Hand-drawn connector arrow between cards */}
              {index < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                  <DoodleArrow size={34} color="var(--purple-primary)" direction="down" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <button onClick={() => onNavigate('upload')} className="btn btn-primary btn-lg">
          <span>Test with Sample Video Footage</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
