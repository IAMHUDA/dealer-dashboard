import React from 'react';

const Card = ({ children, title, subtitle, className = '', ...props }) => {
  return (
    <div 
      className={`glass-card ${className}`} 
      style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}
      {...props}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '1.5rem' }}>
          {title && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{subtitle}</p>}
        </div>
      )}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
