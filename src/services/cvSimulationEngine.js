// SHENEX Real-Time Spatial Computer Vision Simulation & Heatmap Engine

export class CVSimulationEngine {
  constructor(preset) {
    this.preset = preset;
    this.currentFrame = 0;
    this.totalFrames = 120;
    this.people = [];
    this.initPeople();
  }

  initPeople() {
    // Initialize detected persons with persistent tracking IDs
    const trajs = (this.preset && this.preset.trajectories) ? this.preset.trajectories : [];
    this.people = trajs.map((traj, idx) => ({
      id: traj.id,
      label: traj.label || `Track ${traj.id}`,
      color: traj.color || '#6C4AB6',
      points: traj.points && traj.points.length > 0 ? traj.points : [[50, 50]],
      currentPointIdx: 0,
      x: traj.points && traj.points.length > 0 ? traj.points[0][0] : 50,
      y: traj.points && traj.points.length > 0 ? traj.points[0][1] : 50,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      dwellSeconds: traj.dwell_seconds || 60,
      activeZone: null,
    }));
  }

  step() {
    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;

    // Advance people along their path or interpolate gently
    this.people.forEach((p) => {
      const pts = p.points;
      const targetIdx = Math.floor((this.currentFrame / this.totalFrames) * (pts.length - 1));
      const nextIdx = Math.min(targetIdx + 1, pts.length - 1);
      const ratio = ((this.currentFrame / this.totalFrames) * (pts.length - 1)) % 1;

      const p1 = pts[targetIdx];
      const p2 = pts[nextIdx];

      // Smooth interpolation
      p.x = p1[0] + (p2[0] - p1[0]) * ratio + (Math.sin(this.currentFrame * 0.1) * 0.5);
      p.y = p1[1] + (p2[1] - p1[1]) * ratio + (Math.cos(this.currentFrame * 0.1) * 0.5);

      // Determine active zone
      p.activeZone = this.findZoneForPoint(p.x, p.y);
    });

    return {
      frame: this.currentFrame,
      occupancy: this.people.length,
      people: this.people,
    };
  }

  findZoneForPoint(x, y) {
    for (const z of this.preset.zones) {
      if (x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height) {
        return z.name;
      }
    }
    return 'Corridor / Circulation';
  }

  /**
   * Render a beautiful 2D Gaussian density heatmap onto an HTML5 Canvas context
   */
  renderHeatmap(ctx, width, height, mode = 'full') {
    ctx.clearRect(0, 0, width, height);

    // Create an offscreen buffer for density points
    const points = [];

    // Collect all historical points from trajectories + active positions
    this.preset.trajectories.forEach((traj) => {
      traj.points.forEach(([px, py]) => {
        points.push({
          x: (px / 100) * width,
          y: (py / 100) * height,
          intensity: 0.65,
        });
      });
    });

    // Add current live positions with boosted weight
    this.people.forEach((p) => {
      points.push({
        x: (p.x / 100) * width,
        y: (p.y / 100) * height,
        intensity: 0.95,
      });
    });

    // Render radial blurred gradient spots
    points.forEach((pt) => {
      const radius = Math.min(width, height) * 0.12;
      const grad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, radius);

      if (mode === 'fire') {
        grad.addColorStop(0, 'rgba(255, 60, 40, 0.55)');
        grad.addColorStop(0.4, 'rgba(255, 170, 0, 0.35)');
        grad.addColorStop(0.7, 'rgba(108, 74, 182, 0.18)');
        grad.addColorStop(1, 'rgba(108, 74, 182, 0)');
      } else {
        // Soft Plum & Mint & Amber palette to honor brand identity
        grad.addColorStop(0, 'rgba(255, 110, 80, 0.55)');
        grad.addColorStop(0.35, 'rgba(245, 158, 11, 0.35)');
        grad.addColorStop(0.65, 'rgba(108, 74, 182, 0.2)');
        grad.addColorStop(1, 'rgba(52, 179, 138, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
