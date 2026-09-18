import React from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { DoodleClock } from './doodles/DoodleIndex';

export const TimeSlider = ({ currentTime, maxTime, isPlaying, onTogglePlay, onSeek, onReset, speed = 1, onToggleSpeed }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'var(--cream-card)',
      border: '1.5px solid var(--lavender-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.4rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Play/Pause control */}
      <button 
        onClick={onTogglePlay}
        className="btn btn-primary btn-sm"
        style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
        title={isPlaying ? 'Pause timeline' : 'Play timeline'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
      </button>

      {/* Reset */}
      <button 
        onClick={onReset}
        className="btn btn-secondary btn-sm"
        style={{ width: '34px', height: '34px', padding: 0, borderRadius: '50%' }}
        title="Rewind to start"
      >
        <RotateCcw size={14} />
      </button>

      {/* Time display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '95px' }}>
        <DoodleClock size={24} />
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: 'var(--plum-deep)' }}>
          {formatTime(currentTime)} / {formatTime(maxTime)}
        </span>
      </div>

      {/* Scrub Slider */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <input 
          type="range"
          min="0"
          max={maxTime}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            accentColor: 'var(--purple-primary)',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Playback speed toggle */}
      <button 
        onClick={onToggleSpeed}
        className="btn btn-secondary btn-sm"
        style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.6rem' }}
        title="Toggle playback speed"
      >
        <FastForward size={13} style={{ marginRight: '4px' }} />
        {speed}x
      </button>
    </div>
  );
};
