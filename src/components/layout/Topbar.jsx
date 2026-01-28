import React from 'react';
import { Bell, User } from 'lucide-react';

const Topbar = ({ title }) => {
  return (
    <header style={{
      height: '70px',
      padding: '0 2rem',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Penjelasan: Bagian Notifikasi dan Akun pada Topbar dihapus sesuai permintaan user */}
      </div>
    </header>
  );
};

export default Topbar;
