import React, { useState, useEffect } from 'react';
import { DoodleClock, DoodleEye, DoodleSparkle, DoodleHeatmap } from '../components/doodles/DoodleIndex';
import { History, Trash2, Eye, Calendar, Clock, Users, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { databaseService, authService } from '../services/supabaseClient';

export const HistoryPage = ({ currentUser, onLoadAnalysis, onNavigate }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserHistory();
  }, [currentUser]);

  const loadUserHistory = async () => {
    setLoading(true);
    if (!currentUser) {
      setAnalyses([]);
      setLoading(false);
      return;
    }

    try {
      const records = await databaseService.getUserAnalyses(currentUser.id);
      setAnalyses(records);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (analysisId, e) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (confirm('Are you sure you want to remove this analysis from your history?')) {
      await databaseService.deleteAnalysis(currentUser.id, analysisId);
      setAnalyses(prev => prev.filter(a => a.analysis_id !== analysisId));
    }
  };

  const handleSelect = (analysis) => {
    onLoadAnalysis(analysis);
    onNavigate('dashboard');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-pill badge-mint">Persistent Records</span>
            {currentUser && (
              <span style={{ fontSize: '0.85rem', color: 'var(--purple-primary)', fontWeight: 700 }}>
                @{currentUser.username}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--plum-deep)' }}>
            Spatial Analysis History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review, inspect, or reload previously computed computer vision spatial runs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadUserHistory} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => onNavigate('upload')} className="btn btn-primary btn-sm">
            <span>Analyze New Video</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <DoodleEye size={64} className="doodle-wobble" />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Loading your spatial history...
          </p>
        </div>
      ) : !currentUser ? (
        /* Not logged in banner */
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px dashed var(--purple-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
        }}>
          <DoodlePerson size={72} color="var(--purple-primary)" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
            Sign In to View Analysis History
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0.5rem auto 1.5rem', fontSize: '0.95rem' }}>
            Every analysis you perform is saved to your personal profile so you can inspect historical occupancy trends anytime.
          </p>
          <button onClick={() => onNavigate('auth')} className="btn btn-primary">
            Sign In with Username
          </button>
        </div>
      ) : analyses.length === 0 ? (
        /* Empty History State */
        <div style={{
          background: 'var(--cream-card)',
          border: '1.5px solid var(--lavender-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <DoodleClock size={72} color="var(--plum-deep)" accent="var(--mint-accent)" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--plum-deep)', marginTop: '1rem' }}>
            No analyses recorded yet.
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0.5rem auto 1.8rem', fontSize: '0.95rem' }}>
            Your space is waiting. Upload your first 360° or indoor surveillance video to generate real computer vision analytics.
          </p>
          <button onClick={() => onNavigate('upload')} className="btn btn-primary btn-lg">
            <span>Upload Your First Video</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        /* Table of Real Analyses */
        <div className="zones-table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Video & Analysis ID</th>
                <th>Recorded Date</th>
                <th>Duration</th>
                <th>Peak Occupancy</th>
                <th>Avg Occupancy</th>
                <th>Model</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((item) => {
                const meta = item.video_metadata || {};
                const createdDate = new Date(item.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr
                    key={item.analysis_id}
                    onClick={() => handleSelect(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div>
                        <strong style={{ color: 'var(--plum-deep)', fontSize: '0.95rem', display: 'block' }}>
                          {meta.filename || 'Processed Video'}
                        </strong>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--purple-primary)' }}>
                          {item.analysis_id}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {createdDate}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {meta.duration_formatted || `${meta.duration_seconds || 0}s`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--plum-deep)' }}>
                        {item.peak_occupancy} ppl
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {item.average_occupancy} ppl
                      </span>
                    </td>
                    <td>
                      <span className="badge-pill badge-mint" style={{ fontSize: '0.7rem' }}>
                        YOLOv8 + ByteTrack
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelect(item); }}
                          className="btn btn-secondary btn-sm"
                          title="Open Analysis"
                        >
                          <Eye size={14} /> Open
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.analysis_id, e)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#E53E3E' }}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
