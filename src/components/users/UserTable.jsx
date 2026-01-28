import React from 'react';
import Button from '../common/Button';
import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete, loading }) => {
  // Penjelasan: Menyesuaikan header tabel agar menampilkan informasi profil penting
  const headers = ['Nama', 'Email', 'No. HP', 'Lokasi', 'Role', 'Status', 'Aksi'];

  const renderRow = (user) => (
    <>
      <td style={{ padding: '1rem' }}>
        <div style={{ fontWeight: '500' }}>{user.name}</div>
      </td>
      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
      {/* Penjelasan: Menambahkan kolom Nomor HP dan Lokasi (Kabupaten) sesuai isian pendaftaran */}
      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.hpNumber || '-'}</td>
      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.kabupaten || '-'}</td>
      <td style={{ padding: '1rem' }}>
        <span style={{ 
          padding: '4px 10px', 
          borderRadius: '99px', 
          fontSize: '0.75rem', 
          fontWeight: '600',
          backgroundColor: user.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)',
          color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--secondary)'
        }}>
          {user.role}
        </span>
      </td>
      <td style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {user.isActive ? (
            <>
              <CheckCircle size={16} color="var(--success)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>Aktif</span>
            </>
          ) : (
            <>
              <XCircle size={16} color="var(--danger)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>Nonaktif</span>
            </>
          )}
        </div>
      </td>
      <td style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => onEdit(user)}
            style={{ 
              background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px',
              transition: 'var(--transition)'
            }}
            title="Edit User"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(user.id)}
            style={{ 
              background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px',
              transition: 'var(--transition)'
            }}
            title="Hapus User"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </>
  );

  return (
    <div style={{ 
      width: '100%', 
      overflowX: 'auto',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--glass-border)',
      backgroundColor: 'rgba(30, 41, 59, 0.3)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
            {headers.map((header, idx) => (
              <th key={idx} style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto' }}></div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr 
                key={user.id} 
                style={{ 
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'var(--transition)'
                }}
                className="table-row"
              >
                {renderRow(user)}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{`
        .table-row:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default UserTable;
