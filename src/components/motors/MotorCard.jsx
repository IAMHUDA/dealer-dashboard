import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Edit2, Trash2, Tag, Calendar, Palette } from 'lucide-react';
import Button from '../common/Button';

const MotorCard = ({ motor, onEdit, onDelete, isAdmin }) => {
  const statusColors = {
    AVAILABLE: 'var(--success)',
    SOLD: 'var(--danger)'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
      className="glass-card"
    >
      <div style={{
        height: '160px',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {motor.gambar ? (
          <img 
            src={`http://localhost:3000/${motor.gambar}`} 
            alt={motor.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Bike size={64} color="var(--primary)" style={{ opacity: 0.3 }} />
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 10px',
          borderRadius: '99px',
          fontSize: '0.75rem',
          fontWeight: '700',
          backgroundColor: `${statusColors[motor.status]}20`,
          color: statusColors[motor.status],
          border: `1px solid ${statusColors[motor.status]}40`,
          zIndex: 2,
          backdropFilter: 'blur(4px)'
        }}>
          {statusColors[motor.status] === 'var(--success)' ? 'Tersedia' : 'Terjual'}
        </div>
      </div>

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>{motor.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{motor.brand}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>{motor.year}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <Palette size={14} />
            <span>{motor.color}</span>
          </div>
        </div>

        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginTop: 'auto' }}>
          Rp {Number(motor.price).toLocaleString('id-ID')}
        </div>
        
        {/* Penjelasan: Menampilkan siapa yang menambahkan motor agar Sales tahu unit mana yang milik Dealer/Admin */}
        {motor.user && (
           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
             Ditambahkan oleh: {motor.user.name} {motor.user.role === 'ADMIN' ? '(Dealer)' : ''}
           </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button 
            variant="outline" 
            style={{ flex: 1, padding: '6px' }} 
            onClick={() => onEdit(motor)}
          >
            <Edit2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            style={{ flex: 1, padding: '6px', color: 'var(--danger)' }} 
            onClick={() => onDelete(motor.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MotorCard;
