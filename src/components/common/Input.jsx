import React from 'react';

const Input = ({ label, error, className = '', icon: Icon, type = 'text', ...props }) => {
  // Penjelasan: State untuk toggle password visibility
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Import icon mata secara dinamis jika belum diimport di atas (tapi sebaiknya di parent)
  // Kita asumsikan parent akan passing icon mata jika butuh, atau kita pakai teks 'Show'/'Hide' sederhana dulu
  // Untuk hasil terbaik kita gunakan Lucide icon Eye dan EyeOff
  // Namun karena keterbatasan import di sini, kita gunakan SVG inline atau button sederhana
  
  return (
    <div className={`input-group ${className}`} style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
          {label} {props.required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ 
            position: 'absolute', 
            left: '0.875rem', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            paddingLeft: Icon ? '2.75rem' : '1rem',
            paddingRight: isPassword ? '2.75rem' : '1rem', // Space untuk icon mata
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--glass-border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'white',
            outline: 'none',
            transition: 'var(--transition)',
            fontSize: '0.9375rem'
          }}
          className="custom-input"
          {...props}
        />
        
        {/* Toggle Password Icon */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            tabIndex="-1"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '-0.25rem' }}>
          {error}
        </span>
      )}
      <style>{`
        .custom-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Input;
