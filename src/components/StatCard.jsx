import React from 'react';

export const StatCard = ({ icon: Icon, doodle: Doodle, value, label, trend, trendType = 'positive', subtitle }) => {
  return (
    <div className="kpi-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span className="kpi-label">{label}</span>
        <div className="kpi-num">{value}</div>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</span>
        )}
        {trend && (
          <span 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: trendType === 'positive' ? 'var(--mint-accent)' : trendType === 'warning' ? 'var(--peach-accent)' : 'var(--purple-primary)',
              marginTop: '4px'
            }}
          >
            {trend}
          </span>
        )}
      </div>

      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '16px',
        background: 'var(--lavender-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {Doodle ? (
          <Doodle size={36} />
        ) : Icon ? (
          <Icon size={24} color="var(--purple-primary)" />
        ) : null}
      </div>
    </div>
  );
};
