import React, { useState, useEffect, useRef } from 'react';
import { Layers, Flame, Navigation as NavIcon, Users, Sliders, Maximize2, Info } from 'lucide-react';
import { CVSimulationEngine } from '../services/cvSimulationEngine';

export const FloorplanViewer = ({ preset, liveFrame = 0 }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [heatmapTheme, setHeatmapTheme] = useState('plum'); // 'plum' or 'fire'
  const [selectedItem, setSelectedItem] = useState(null);

  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Initialize or update simulation engine when preset changes
  useEffect(() => {
    engineRef.current = new CVSimulationEngine(preset);
  }, [preset]);

  // Update canvas when options or frame changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !engineRef.current) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Architectural Floor Background Grid
    drawGrid(ctx, width, height);

    // 2. Draw Zones if enabled
    if (showZones) {
      drawZones(ctx, width, height, preset.zones);
    }

    // 3. Draw Heatmap Layer if enabled
    if (showHeatmap) {
      const realMatrix = preset.heatmapMatrix || preset.heatmap;
      if (realMatrix && realMatrix.length > 0) {
        drawRealHeatmap(ctx, width, height, realMatrix, heatmapTheme);
      } else if (engineRef.current) {
        engineRef.current.renderHeatmap(ctx, width, height, heatmapTheme);
      }
    }

    // 4. Draw Trajectory Paths if enabled
    if (showPaths && preset.trajectories) {
      drawTrajectories(ctx, width, height, preset.trajectories);
    }

    // 5. Update engine state if available
    if (engineRef.current) {
      engineRef.current.step();
    }

  }, [preset, liveFrame, showHeatmap, showPaths, showZones, heatmapTheme]);

  const drawRealHeatmap = (ctx, w, h, matrix, theme) => {
    if (!matrix || matrix.length === 0) return;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const cellW = w / cols;
    const cellH = h / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = matrix[r][c];
        if (val > 0.04) {
          const px = c * cellW + cellW / 2;
          const py = r * cellH + cellH / 2;
          const rad = Math.max(cellW, cellH) * 2.8;

          const grad = ctx.createRadialGradient(px, py, 1, px, py, rad);
          if (theme === 'fire') {
            grad.addColorStop(0, `rgba(255, 60, 40, ${Math.min(0.85, val * 0.9)})`);
            grad.addColorStop(0.4, `rgba(255, 170, 0, ${val * 0.45})`);
            grad.addColorStop(1, 'rgba(255, 170, 0, 0)');
          } else {
            grad.addColorStop(0, `rgba(255, 110, 80, ${Math.min(0.9, val * 0.95)})`);
            grad.addColorStop(0.35, `rgba(245, 158, 11, ${val * 0.45})`);
            grad.addColorStop(0.7, `rgba(108, 74, 182, ${val * 0.25})`);
            grad.addColorStop(1, 'rgba(108, 74, 182, 0)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const drawGrid = (ctx, w, h) => {
    ctx.strokeStyle = 'rgba(108, 74, 182, 0.07)';
    ctx.lineWidth = 1;
    const step = 28;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const drawZones = (ctx, w, h, zones) => {
    zones.forEach((z) => {
      const zx = (z.x / 100) * w;
      const zy = (z.y / 100) * h;
      const zw = (z.width / 100) * w;
      const zh = (z.height / 100) * h;

      // Soft zone background fill
      ctx.fillStyle = 'rgba(244, 239, 254, 0.45)';
      ctx.fillRect(zx, zy, zw, zh);

      // Dashed boundary
      ctx.save();
      ctx.strokeStyle = z.color || '#6C4AB6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(zx, zy, zw, zh);
      ctx.restore();

      // Zone Tag Label
      ctx.fillStyle = z.color || '#381B41';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillText(z.name, zx + 10, zy + 22);

      ctx.fillStyle = '#6C4AB6';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.fillText(`Avg: ${z.dwellAvg}m • ${z.status}`, zx + 10, zy + 36);
    });
  };

  const drawTrajectories = (ctx, w, h, trajectories) => {
    trajectories.forEach((traj) => {
      if (!traj.points || traj.points.length < 2) return;

      ctx.save();
      ctx.strokeStyle = traj.color || '#6C4AB6';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();

      traj.points.forEach(([px, py], index) => {
        const x = (px / 100) * w;
        const y = (py / 100) * h;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw start and end arrow dots
      const endPt = traj.points[traj.points.length - 1];
      ctx.fillStyle = traj.color || '#6C4AB6';
      ctx.beginPath();
      ctx.arc((endPt[0] / 100) * w, (endPt[1] / 100) * h, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  return (
    <div className="interactive-viewport">
      {/* Viewport Toolbar */}
      <div className="viewport-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Spatial Layers:
          </span>

          <div className="toggle-group">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`toggle-item ${showHeatmap ? 'active' : ''}`}
            >
              <Flame size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Heatmap
            </button>

            <button
              onClick={() => setShowPaths(!showPaths)}
              className={`toggle-item ${showPaths ? 'active' : ''}`}
            >
              <NavIcon size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Flow Paths
            </button>

            <button
              onClick={() => setShowZones(!showZones)}
              className={`toggle-item ${showZones ? 'active' : ''}`}
            >
              <Layers size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Zones
            </button>

            <button
              onClick={() => setShowPeople(!showPeople)}
              className={`toggle-item ${showPeople ? 'active' : ''}`}
            >
              <Users size={13} style={{ display: 'inline', marginRight: '4px' }} />
              People
            </button>
          </div>
        </div>

        {/* Heatmap Palette Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Palette:</span>
          <button
            onClick={() => setHeatmapTheme(heatmapTheme === 'plum' ? 'fire' : 'plum')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}
          >
            {heatmapTheme === 'plum' ? '🌸 Soft Plum/Amber' : '🔥 Thermal Fire'}
          </button>
        </div>
      </div>

      {/* Main Visual Stage Canvas */}
      <div className="canvas-holder" style={{ background: '#FAF7F2', border: '1.5px solid var(--lavender-border)' }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={480}
          className="heatmap-layer"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Overlay Interactive Person Markers */}
        {showPeople && engineRef.current?.people.map((person) => (
          <div
            key={person.id}
            className="person-avatar-marker"
            style={{
              left: `${person.x}%`,
              top: `${person.y}%`,
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
            onClick={() => setSelectedItem(person)}
          >
            <div className="person-radar-ring" style={{ borderColor: person.color }}></div>
            <div className="person-circle" style={{ background: person.color }}>
              {person.id.replace('#', '')}
            </div>
            <div style={{
              marginTop: '3px',
              background: 'rgba(37, 18, 43, 0.9)',
              color: 'white',
              padding: '1px 5px',
              borderRadius: '4px',
              fontSize: '0.62rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              {person.activeZone || 'Active'}
            </div>
          </div>
        ))}

        {/* Selected Item Detail Popover */}
        {selectedItem && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'white',
            borderRadius: '16px',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--purple-primary)',
            maxWidth: '300px',
            zIndex: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ color: 'var(--plum-deep)', fontSize: '0.95rem' }}>
                {selectedItem.id ? `Anonymous Track ${selectedItem.id}` : selectedItem.name}
              </strong>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Current Zone: <strong>{selectedItem.activeZone || selectedItem.name || 'Circulation Area'}</strong>
            </p>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
              <span className="badge-pill badge-mint">
                Dwell: {selectedItem.dwell || `${selectedItem.dwellAvg || 12}m`}
              </span>
              <span className="badge-pill">
                Status: {selectedItem.status || 'Active'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floorplan Footer Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1rem',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
      }}>
        <div>
          <span>Scenario: <strong>{preset.title}</strong></span>
          <span style={{ marginLeft: '12px' }}>Resolution: {preset.resolution}</span>
        </div>
        <div>
          <span>Projection: <strong>Equirectangular to 2D Planar Homography</strong></span>
        </div>
      </div>
    </div>
  );
};
