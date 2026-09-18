import React from 'react';
import { HeroVisualization } from '../components/HeroVisualization';
import { 
  DoodleEye, 
  DoodleCamera, 
  DoodleCCTV, 
  DoodlePerson, 
  DoodleFootprints, 
  DoodleClock, 
  DoodleHeatmap, 
  DoodleBrain, 
  DoodleRadar, 
  DoodleZone, 
  DoodleSparkle, 
  DoodleArrow 
} from '../components/doodles/DoodleIndex';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export const LandingPage = ({ onNavigate, onSelectPreset }) => {
  const featureCards = [
    {
      id: 1,
      title: 'Occupancy Intelligence',
      desc: 'Understand how many people occupy a space and how occupancy changes dynamically over time.',
      doodle: DoodlePerson,
      color: 'var(--purple-primary)',
      accent: 'var(--peach-accent)',
    },
    {
      id: 2,
      title: 'Spatial Heatmaps',
      desc: 'Visualize areas where human activity and spatial presence are concentrated using Gaussian density estimation.',
      doodle: DoodleHeatmap,
      color: 'var(--peach-accent)',
      accent: 'var(--amber-accent)',
    },
    {
      id: 3,
      title: 'Movement Patterns',
      desc: 'Understand common movement paths, directional flow vectors, and frequent circulation routes.',
      doodle: DoodleFootprints,
      color: 'var(--purple-vibrant)',
      accent: 'var(--mint-accent)',
    },
    {
      id: 4,
      title: 'Dwell Time Estimation',
      desc: 'Measure how long individuals linger and remain engaged within defined physical zones.',
      doodle: DoodleClock,
      color: 'var(--plum-deep)',
      accent: 'var(--peach-accent)',
    },
    {
      id: 5,
      title: 'Traffic Zones',
      desc: 'Identify high-traffic thoroughfares and underutilized low-traffic spaces to optimize spatial layout.',
      doodle: DoodleZone,
      color: 'var(--mint-accent)',
      accent: 'var(--purple-primary)',
    },
    {
      id: 6,
      title: 'AI Spatial Insights',
      desc: 'Convert raw computer-vision coordinates into understandable, actionable architectural and operational recommendations.',
      doodle: DoodleBrain,
      color: 'var(--plum-deep)',
      accent: 'var(--mint-accent)',
    },
  ];

  const pipelineSteps = [
    { step: '01', title: 'Upload', desc: 'Provide a 360° panoramic indoor video feed.', doodle: DoodleCamera },
    { step: '02', title: 'Detect', desc: 'Detect people accurately across panoramic angles.', doodle: DoodlePerson },
    { step: '03', title: 'Track', desc: 'Track anonymous IDs across consecutive frames.', doodle: DoodleRadar },
    { step: '04', title: 'Analyze', desc: 'Calculate occupancy, trajectories, and dwell times.', doodle: DoodleClock },
    { step: '05', title: 'Visualize', desc: 'Generate heatmaps, traffic zones, and flow lines.', doodle: DoodleHeatmap },
    { step: '06', title: 'Insight', desc: 'Turn spatial analytics into actionable recommendations.', doodle: DoodleBrain },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="badge-pill">
                <DoodleSparkle size={18} color="var(--purple-primary)" />
                <span>✦ COMPUTER VISION • SPATIAL INTELLIGENCE ✦</span>
              </div>

              <h1 className="hero-title">
                See the Space. <br />
                <span className="highlight">Understand the Movement.</span>
              </h1>

              <p className="hero-subtitle">
                SHENEX transforms 360° indoor surveillance footage into meaningful occupancy, dwell time, and spatial movement insights — powered by privacy-preserving computer vision.
              </p>

              <div className="hero-buttons">
                <button 
                  onClick={() => onNavigate('upload')} 
                  className="btn btn-primary btn-lg"
                >
                  <span>Start Analysis</span>
                  <ArrowRight size={18} />
                </button>

                <button 
                  onClick={() => onNavigate('how-it-works')} 
                  className="btn btn-secondary btn-lg"
                >
                  <Play size={16} />
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Trust & Metric Highlights */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <span className="hero-stat-val">360°</span>
                  <span className="hero-stat-lbl">Fisheye & Equirectangular</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-val">100%</span>
                  <span className="hero-stat-lbl">Anonymous Centroid Tracking</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-val">&lt; 35ms</span>
                  <span className="hero-stat-lbl">Real-time Inference Speed</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Visualization */}
            <div>
              <HeroVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header-center">
            <span className="badge-pill badge-mint">Intelligent Capabilities</span>
            <h2 className="section-title">Everything Needed to Decode Indoor Spaces</h2>
            <p className="section-lead">
              Transforming complex omnidirectional video frames into crisp spatial analytics, visual heatmaps, and actionable insights.
            </p>
          </div>

          <div className="feature-cards-grid">
            {featureCards.map((feat) => {
              const DoodleComp = feat.doodle;
              return (
                <div key={feat.id} className="feature-card">
                  <div className="feature-card-doodle">
                    <DoodleComp size={42} color={feat.color} accent={feat.accent} />
                  </div>
                  <h3 className="feature-card-title">{feat.title}</h3>
                  <p className="feature-card-desc">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="pipeline-section" id="how-it-works">
        <div className="container">
          <div className="section-header-center">
            <span className="badge-pill">Autonomous CV Pipeline</span>
            <h2 className="section-title">From 360° Pixels to Spatial Understanding</h2>
            <p className="section-lead">
              A 6-step computer vision pipeline designed specifically for indoor surveillance architectures.
            </p>
          </div>

          <div className="pipeline-steps-grid">
            {pipelineSteps.map((step, index) => {
              const StepDoodle = step.doodle;
              return (
                <div key={step.step} className="pipeline-step-card">
                  <span className="pipeline-step-num">{step.step}</span>
                  <div style={{ margin: '6px 0' }}>
                    <StepDoodle size={38} color="var(--purple-primary)" />
                  </div>
                  <h4 className="pipeline-step-title">{step.title}</h4>
                  <p className="pipeline-step-desc">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => onNavigate('how-it-works')} 
              className="btn btn-secondary"
            >
              <span>Read Full Computer Vision Architecture</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Try Demo Presets Callout */}
      <section style={{ padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--plum-deep) 0%, var(--purple-primary) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 3rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-lg)',
            flexWrap: 'wrap',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ maxWidth: '600px', zIndex: 2 }}>
              <span className="badge-pill badge-mint" style={{ marginBottom: '1rem' }}>
                Instant Evaluation Ready
              </span>
              <h2 style={{ fontSize: '2.4rem', color: 'white', fontWeight: 800, marginBottom: '1rem' }}>
                Analyze 360° Footage in Seconds
              </h2>
              <p style={{ color: '#E8DCFC', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Test SHENEX with our pre-processed 360° datasets: Coworking Lounges, Flagship Concept Stores, or Tech Hackathons.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', zIndex: 2 }}>
              <button 
                onClick={() => onNavigate('upload')} 
                className="btn btn-mint btn-lg"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Decorative Doodle in Background */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.15, pointerEvents: 'none' }}>
              <DoodleHeatmap size={260} color="#FFFFFF" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
