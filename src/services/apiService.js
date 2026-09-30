/**
 * SHENEX Real Computer Vision API Service
 * Connects to FastAPI Ultralytics YOLOv8 backend.
 * Zero hardcoded mock numbers. Zero fake fallbacks.
 * Streams real-time frame progress directly from Python.
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '/api';

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
   * Primary uploadVideo function connecting to FastAPI /api/upload-stream
   * Reads real-time progress chunks directly from the computer vision pipeline.
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

    reportProgress(1, 5, 'Uploading video to SHENEX FastAPI backend...');

    const formData = new FormData();
    formData.append('file', fileOrScenario);

    try {
      // 1. Attempt Real-Time Streaming Progress Endpoint
      const streamRes = await fetch(`${API_BASE}/upload-stream`, {
        method: 'POST',
        body: formData,
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalResult = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep trailing partial line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const msg = JSON.parse(trimmed);
              if (msg.type === 'progress') {
                reportProgress(msg.stageIndex || 2, msg.percent || msg.progressPercent || 25, msg.stage);
              } else if (msg.type === 'complete') {
                reportProgress(7, 100, msg.stage || 'Analysis complete!');
                finalResult = msg.payload;
              } else if (msg.type === 'error') {
                throw new Error(msg.message || 'Computer Vision analysis failed.');
              }
            } catch (parseErr) {
              if (parseErr.message && parseErr.message.includes('Computer Vision analysis failed')) {
                throw parseErr;
              }
            }
          }
        }

        if (finalResult) {
          return finalResult;
        }
      }

      // 2. Standard Fallback endpoint if streaming not supported
      reportProgress(2, 30, 'Detecting people & tracking with ByteTrack...');
      const fallbackRes = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!fallbackRes.ok) {
        const errJson = await fallbackRes.json().catch(() => ({ detail: fallbackRes.statusText }));
        throw new Error(errJson.detail || 'Computer Vision analysis failed.');
      }

      reportProgress(6, 95, 'Synthesizing spatial occupancy and density heatmap...');
      const data = await fallbackRes.json();
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
   * Uses real-time progress streaming.
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

    reportProgress(1, 5, `Loading verified test scenario: ${scenarioId.toUpperCase()}...`);

    try {
      // 1. Attempt Streaming Scenario Endpoint
      const streamRes = await fetch(`${API_BASE}/analyze-scenario-stream?scenario_id=${scenarioId}`, {
        method: 'POST',
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalResult = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
              const msg = JSON.parse(trimmed);
              if (msg.type === 'progress') {
                reportProgress(msg.stageIndex || 2, msg.percent || msg.progressPercent || 25, msg.stage);
              } else if (msg.type === 'complete') {
                reportProgress(7, 100, msg.stage || 'Analysis ready!');
                finalResult = msg.payload;
              } else if (msg.type === 'error') {
                throw new Error(msg.message || `Failed to analyze scenario ${scenarioId}.`);
              }
            } catch (parseErr) {
              if (parseErr.message && parseErr.message.includes('Failed to analyze scenario')) {
                throw parseErr;
              }
            }
          }
        }

        if (finalResult) {
          return finalResult;
        }
      }

      // 2. Standard Fallback endpoint
      reportProgress(2, 40, 'Running Ultralytics YOLOv8 & ByteTrack tracking...');
      const fallbackRes = await fetch(`${API_BASE}/analyze-scenario?scenario_id=${scenarioId}`, {
        method: 'POST',
      });

      if (!fallbackRes.ok) {
        const errJson = await fallbackRes.json().catch(() => ({ detail: fallbackRes.statusText }));
        throw new Error(errJson.detail || `Failed to analyze scenario ${scenarioId}.`);
      }

      reportProgress(6, 95, 'Synthesizing spatial metrics...');
      const data = await fallbackRes.json();
      reportProgress(7, 100, 'Analysis ready!');
      return data;

    } catch (err) {
      throw new Error(`Scenario Analysis Error: ${err.message}`);
    }
  },
};
