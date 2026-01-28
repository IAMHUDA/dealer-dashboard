import React, { useState, useEffect } from 'react';
import { Plus, Bike, Grid, List } from 'lucide-react';
import MotorCard from '../components/motors/MotorCard';
import MotorModal from '../components/motors/MotorModal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import notifications from '../utils/notifications';

const MotorManagement = () => {
  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const { isAdmin } = useAuth();

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/motors');
      setMotors(response.data);
    } catch (error) {
      console.error('Failed to fetch motors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  const handleCreate = () => {
    setSelectedMotor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (motor) => {
    setSelectedMotor(motor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await notifications.confirm(
      'Hapus Motor?',
      'Apakah Anda yakin ingin menghapus motor ini? Data tidak bisa dikembalikan.'
    );

    if (confirmed) {
      try {
        await api.delete(`/motors/${id}`);
        notifications.success('Motor berhasil dihapus');
        fetchMotors();
      } catch (error) {
        notifications.error(error.response?.data?.message || 'Gagal menghapus motor');
      }
    }
  };

  const handleSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (selectedMotor) {
        await api.put(`/motors/${selectedMotor.id}`, formData);
      } else {
        await api.post('/motors', formData);
      }
      setIsModalOpen(false);
      notifications.success(selectedMotor ? 'Motor berhasil diperbarui' : 'Motor berhasil ditambahkan');
      fetchMotors();
    } catch (error) {
      notifications.error(error.response?.data?.message || 'Operasi gagal');
    } finally {
      setModalLoading(false);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'none' }}></div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" style={{ padding: '10px' }}>
            <Grid size={18} />
          </Button>
          <Button onClick={handleCreate} icon={Plus}>
            Tambah Motor
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loader"></div>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <AnimatePresence>
            {motors.map((motor) => (
              <MotorCard 
                key={motor.id} 
                motor={motor} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                isAdmin={isAdmin}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {motors.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          backgroundColor: 'rgba(30, 41, 59, 0.3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-muted)'
        }}>
          <Bike size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Belum ada data motor</p>
        </div>
      )}

      <MotorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        motor={selectedMotor}
        loading={modalLoading}
      />
    </div>
  );
};

export default MotorManagement;
