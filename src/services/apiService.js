/**
 * SHENEX Real Computer Vision API Service
 * Connects to FastAPI Ultralytics YOLOv8 backend.
 * Zero hardcoded mock numbers. Zero fake fallbacks.
 */

const API_BASE = '/api';

export const apiService = {
  /**
   * Check if the real Python YOLO backend is online
   */
  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET', cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        return { online: true, ...data };
      }
    } catch {
      // Backend not yet reachable
    }
    return { online: false, model: 'YOLOv8 + ByteTrack (Starting/Offline)' };
  },

  /**
   * Primary uploadVideo function connecting to FastAPI /api/upload
   */
  async uploadVideo(fileOrScenario, onProgress) {
    if (!fileOrScenario) {
      throw new Error('No video or scenario provided for analysis.');
    }

    // If scenario string ID is passed:
    if (typeof fileOrScenario === 'string' && fileOrScenario.startsWith('test_')) {
      return this.analyzeScenario(fileOrScenario, onProgress);
    }

    const reportProgress = (idx, pct, stageName) => {
      if (onProgress) {
        onProgress({
          stageIndex: idx,
          progressPercent: pct,
          percent: pct,
          stage: stageName,
        });
      }
    };

    reportProgress(1, 15, 'Uploading video to FastAPI /api/upload...');

    const formData = new FormData();
    formData.append('file', fileOrScenario);

    try {
      reportProgress(2, 35, 'Running Ultralytics YOLOv8 Person Detection...');

      // Simulated micro-stage ticker for smooth progress while YOLO inference runs
      const timer = setInterval(() => {
        reportProgress(3, 60, 'Tracking movement & associating anonymous IDs...');
      }, 500);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(timer);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errJson.detail || 'Computer Vision analysis failed.');
      }

      reportProgress(5, 85, 'Computing real occupancy, dwell integrals & density heatmap...');

      const data = await res.json();

      reportProgress(7, 100, 'Analysis complete!');

      return data;
    } catch (err) {
      throw new Error(`Real CV Processing Error: ${err.message}`);
    }
  },

  /**
   * Alias for backward compatibility
   */
  async analyzeVideoFile(file, onProgress) {
    return this.uploadVideo(file, onProgress);
  },

  /**
   * Runs real YOLO analysis on one of the verified test scenarios (A, B, or C)
   */
  async analyzeScenario(scenarioId, onProgress) {
    const reportProgress = (idx, pct, stageName) => {
      if (onProgress) {
        onProgress({
          stageIndex: idx,
          progressPercent: pct,
          percent: pct,
          stage: stageName,
        });
      }
    };

    reportProgress(1, 20, `Loading test scenario: ${scenarioId.toUpperCase()}...`);

    try {
      reportProgress(3, 55, 'Running Ultralytics YOLO inference on frames...');

      const res = await fetch(`${API_BASE}/analyze-scenario?scenario_id=${scenarioId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errJson.detail || `Failed to analyze scenario ${scenarioId}.`);
      }

      reportProgress(6, 90, 'Synthesizing spatial metrics...');

      const data = await res.json();
      reportProgress(7, 100, 'Analysis ready!');
      return data;
    } catch (err) {
      throw new Error(`Scenario Analysis Error: ${err.message}`);
    }
  },
};

