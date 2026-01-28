import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Bike, Tag, Calendar, Palette, DollarSign, Activity } from 'lucide-react';

const MotorModal = ({ isOpen, onClose, onSubmit, motor, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    year: new Date().getFullYear(),
    color: '',
    price: '',
    status: 'AVAILABLE'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (motor) {
      setFormData({
        name: motor.name || '',
        brand: motor.brand || '',
        year: motor.year || new Date().getFullYear(),
        color: motor.color || '',
        price: motor.price || '',
        status: motor.status || 'AVAILABLE'
      });
      // Handle existing image preview
      setImagePreview(motor.gambar ? `http://localhost:3000/${motor.gambar}` : null);
    } else {
      setFormData({
        name: '',
        brand: '',
        year: new Date().getFullYear(),
        color: '',
        price: '',
        status: 'AVAILABLE'
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [motor, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('gambar', imageFile);
    }
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={motor ? 'Edit Motor' : 'Tambah Motor Baru'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input 
            label="Nama Motor" 
            name="name" 
            placeholder="contoh: Vario 160" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ marginBottom: '1rem' }}
          />
          <Input 
            label="Merek" 
            name="brand" 
            placeholder="contoh: Honda" 
            value={formData.brand} 
            onChange={handleChange} 
            required 
            style={{ marginBottom: '1rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input 
            label="Tahun" 
            name="year" 
            type="number"  
            value={formData.year} 
            onChange={handleChange} 
            required 
            style={{ marginBottom: '1rem' }}
          />
          <Input 
            label="Warna" 
            name="color" 
            placeholder="contoh: Hitam Matte" 
            value={formData.color} 
            onChange={handleChange} 
            required 
            style={{ marginBottom: '1rem' }}
          />
        </div>

        <Input 
          label="Harga (IDR)" 
          name="price" 
          type="number" 
          placeholder="contoh: 25000000" 
          value={formData.price} 
          onChange={handleChange} 
          required 
          style={{ marginBottom: '1rem' }}
        />

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Gambar Motor
          </label>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '2px dashed var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            backgroundColor: 'rgba(30, 41, 59, 0.3)'
          }}>
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} 
              />
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pilih gambar produk...</div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              required={!motor}
              style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Status
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['AVAILABLE', 'SOLD'].map((status) => (
              <label 
                key={status}
                style={{ 
                  flex: 1, 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: `1px solid ${formData.status === status ? 'var(--primary)' : 'var(--glass-border)'}`,
                  backgroundColor: formData.status === status ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'var(--transition)'
                }}
              >
                <input 
                  type="radio" 
                  name="status" 
                  value={status} 
                  checked={formData.status === status}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.875rem', color: formData.status === status ? 'white' : 'var(--text-muted)' }}>{status === 'AVAILABLE' ? 'Tersedia' : 'Terjual'}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="secondary" onClick={onClose} type="button" style={{ flex: 1 }}>
            Batal
          </Button>
          <Button type="submit" loading={loading} style={{ flex: 1 }}>
            {motor ? 'Perbarui Motor' : 'Simpan Motor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MotorModal;
