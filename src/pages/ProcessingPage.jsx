import React, { useState, useEffect, useRef } from 'react';
import { 
  DoodleEye, 
  DoodleRadar, 
  DoodleCCTV, 
  DoodleSparkle, 
  DoodleBrain, 
  DoodleHeatmap 
} from '../components/doodles/DoodleIndex';
import { Check, Loader2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { apiService } from '../services/apiService';

export const ProcessingPage = ({ targetVideoOrPreset, onProcessingComplete, onCancel }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const canvasRef = useRef(null);

  const stages = [
    { id: 1, label: 'Video loaded & equirectangular projection parsed' },
    { id: 2, label: 'Detecting people across panoramic visual field' },
    { id: 3, label: 'Tracking movement & associating anonymous IDs' },
    { id: 4, label: 'Mapping spatial occupancy & zone boundaries' },
    { id: 5, label: 'Calculating dwell time & circulation velocity' },
    { id: 6, label: 'Generating 2D Gaussian density heatmap' },
    { id: 7, label: 'Preparing actionable spatial AI insights' },
  ];

  // Start processing on mount
  useEffect(() => {
    let isCancelled = false;

    const runPipeline = async () => {
      try {
        const result = await apiService.uploadVideo(targetVideoOrPreset, (progress) => {
          if (!isCancelled) {
            setCurrentStageIdx(progress.stageIndex);
            setProgressPercent(progress.progressPercent);
          }
        });

        if (!isCancelled) {
          setProgressPercent(100);
          setIsFinished(true);
          setTimeout(() => {
            const payload = (result && result.data) ? result.data : result;
            onProcessingComplete(payload);
          }, 800);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Computer Vision processing encountered an unexpected issue.');
        }
      }
    };

    runPipeline();

    return () => {
      isCancelled = true;
    };
  }, [targetVideoOrPreset]);

  // Visual Computer Vision Scan Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let scanAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw panoramic 360 grid lines
      ctx.strokeStyle = 'rgba(108, 74, 182, 0.2)';
      ctx.lineWidth = 1;
      const cx = w / 2;
      const cy = h / 2;

      // Concentric fisheye radar rings
      for (let r = 30; r < 140; r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Sweep line
      scanAngle += 0.04;
      const sx = cx + Math.cos(scanAngle) * 135;
      const sy = cy + Math.sin(scanAngle) * 135;

      ctx.strokeStyle = 'rgba(78, 204, 163, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      // Sweep gradient fan
      const sweepGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 135);
      sweepGrad.addColorStop(0, 'rgba(78, 204, 163, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(78, 204, 163, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 135, scanAngle - 0.5, scanAngle);
      ctx.closePath();
      ctx.fill();

      // Simulated detected person bounding boxes
      const boxes = [
        { x: cx - 60, y: cy - 40, size: 28 },
        { x: cx + 45, y: cy + 30, size: 32 },
        { x: cx - 20, y: cy + 70, size: 24 },
        { x: cx + 80, y: cy - 50, size: 26 },
      ];

      boxes.forEach((b, idx) => {
        ctx.strokeStyle = '#865DFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y, b.size, b.size * 1.5);

        // Centroid dot
        ctx.fillStyle = '#4ECCA3';
        ctx.beginPath();
        ctx.arc(b.x + b.size / 2, b.y + b.size * 1.5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#381B41';
        ctx.font = '9px monospace';
        ctx.fillText(`#00${idx + 1}`, b.x, b.y - 4);
      });

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="container" style={{ padding: '4rem 1.5rem 6rem' }}>
      <div className="processing-container">
        {/* Animated Scanner Preview */}
        <div style={{
          position: 'relative',
          width: '280px',
          height: '280px',
          margin: '0 auto 2rem',
          borderRadius: '50%',
          boxShadow: 'var(--shadow-glow), var(--shadow-lg)',
          overflow: 'hidden',
          background: '#FAF7F2',
          border: '3px solid var(--purple-primary)',
        }}>
          <canvas ref={canvasRef} width={280} height={280} style={{ width: '100%', height: '100%' }} />

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(37, 18, 43, 0.85)',
            color: 'white',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            360° Omnidirectional Scan
          </div>
        </div>

        {/* Heading */}
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '0.5rem' }}>
          SHENEX is reading the space...
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Unwrapping 360° equirectangular pixels, detecting human centroids, and computing dwell patterns.
        </p>

        {/* Overall Progress Bar */}
        <div style={{
          maxWidth: '520px',
          margin: '0 auto 2.5rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--purple-primary)',
            marginBottom: '6px',
          }}>
            <span>Processing Pipeline</span>
            <span>{progressPercent}%</span>
          </div>

          <div style={{
            width: '100%',
            height: '10px',
            background: 'var(--lavender-border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--purple-primary) 0%, var(--mint-accent) 100%)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Processing Stages Checklist */}
        <div className="stages-checklist" style={{ maxWidth: '560px', margin: '0 auto' }}>
          {stages.map((stage, idx) => {
            const isDone = idx < currentStageIdx || isFinished;
            const isActive = idx === currentStageIdx && !isFinished;
            const isPending = idx > currentStageIdx && !isFinished;

            return (
              <div 
                key={stage.id} 
                className={`stage-item ${isDone ? 'completed' : isActive ? 'active' : 'pending'}`}
              >
                <div className="stage-icon-box">
                  {isDone ? (
                    <Check size={18} strokeWidth={3} />
                  ) : isActive ? (
                    <Loader2 size={18} />
                  ) : (
                    <span style={{ fontSize: '0.75rem' }}>{stage.id}</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive || isDone ? 700 : 500,
                    color: isActive ? 'var(--purple-primary)' : isDone ? 'var(--plum-deep)' : 'var(--text-muted)',
                  }}>
                    {stage.label}
                  </span>
                </div>

                {isDone && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mint-accent)' }}>
                    Done
                  </span>
                )}
                {isActive && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple-primary)' }}>
                    Analyzing...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Error State */}
        {error && (
          <div style={{
            background: '#FFF5F5',
            border: '1.5px solid #FEB2B2',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            marginTop: '2rem',
            color: '#C53030',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '560px',
            margin: '2rem auto 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button onClick={onCancel} className="btn btn-secondary btn-sm">
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
