import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
// Penjelasan: Mengoreksi path import komponen agar sesuai dengan struktur folder
import Button from '../common/Button';
import { User, Mail, Lock, Shield, MapPin, Phone, Globe, Calendar, Users, Heart } from 'lucide-react';
import api from '../../utils/api';
import notifications from '../../utils/notifications';

/**
 * Modal untuk Tambah/Edit User dengan profil lengkap (Sesuai Poin 3)
 */
const UserModal = ({ isOpen, onClose, onSubmit, user, loading }) => {
  // State untuk data formulir
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'SALES', isActive: true,
    ktpAddress: '', currentAddress: '', kecamatan: '', kabupaten: '', provinsi: '',
    phoneNumber: '', hpNumber: '', nationality: 'WNI Asli', nationalityName: '',
    birthDate: '', birthPlace: '', gender: 'Pria', maritalStatus: 'Belum menikah', religion: ''
  });

  // State untuk data referensi (Poin 3a)
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]); // State baru untuk Kecamatan
  const [religions, setReligions] = useState([]);

  // Mengisi data form jika mode EDIT
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Password tidak ditampilkan saat edit
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '', // Format tanggal untuk input date
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      setFormData({
        name: '', email: '', password: '', role: 'SALES', isActive: true,
        ktpAddress: '', currentAddress: '', kecamatan: '', kabupaten: '', provinsi: '',
        phoneNumber: '', hpNumber: '', nationality: 'WNI Asli', nationalityName: '',
        birthDate: '', birthPlace: '', gender: 'Pria', maritalStatus: 'Belum menikah', religion: ''
      });
    }
  }, [user, isOpen]);

  // Penjelasan: Mengambil data referensi (Lookup) saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const fetchRef = async () => {
        try {
          const [p, r] = await Promise.all([
            api.get('/references/provinces'),
            api.get('/references/religions')
          ]);
          setProvinces(p.data);
          setReligions(r.data);
        } catch (e) { console.error(e); }
      };
      fetchRef();
    }
  }, [isOpen]);

  // Penjelasan: Mengambil kabupaten saat provinsi berubah
  useEffect(() => {
    const fetchReg = async () => {
      if (!formData.provinsi) {
        setRegencies([]);
        return;
      }
      const prov = provinces.find(p => p.name === formData.provinsi);
      if (prov) {
        try {
          const res = await api.get(`/references/regencies/${prov.id}`);
          setRegencies(res.data);
          setDistricts([]); // Reset kecamatan saat ganti kabupaten
        } catch (e) { console.error(e); }
      }
    };
    fetchReg();
  }, [formData.provinsi, provinces]);

  // Penjelasan: Mengambil kecamatan saat kabupaten berubah (Tambahan)
  useEffect(() => {
    const fetchDist = async () => {
      if (!formData.kabupaten) {
        setDistricts([]);
        return;
      }
      const reg = regencies.find(r => r.name === formData.kabupaten);
      if (reg) {
        try {
          const res = await api.get(`/references/districts/${reg.id}`);
          setDistricts(res.data);
        } catch (e) { console.error(e); }
      }
    };
    fetchDist();
  }, [formData.kabupaten, regencies]);

  // State untuk warning format email (real-time)
  const [emailWarning, setEmailWarning] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validasi Nomor HP (Poin 3c)
    if (name === 'hpNumber' || name === 'phoneNumber') {
      if (value !== '' && !/^\d+$/.test(value)) {
        // notifications.error('Hanya boleh memasukkan angka!'); // Optional: disable alert spam
        return;
      }
    }

    // Validasi Real-time Email
    if (name === 'email') {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        setEmailWarning('Format email harus valida (contoh: user@example.com)');
      } else {
        setEmailWarning('');
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error saat user mengetik
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // State untuk error validasi
  const [errors, setErrors] = useState({});

  // Daftar Agama Utama (Poin tambahan: Hilangkan Lain-lain, cukup 5 agama)
  const mainReligions = ['Islam', 'Katolik', 'Kristen', 'Hindu', 'Budha'];

  // Validasi Form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nama lengkap harus diisi';
    if (!formData.email) newErrors.email = 'Email harus diisi';
    if (!user && !formData.password) newErrors.password = 'Password harus diisi';
    if (!formData.hpNumber) newErrors.hpNumber = 'Nomor HP harus diisi';
    
    // Validasi format email sederhana
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Cek validasi sebelum submit
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Tampilkan notifikasi error jika ada field yang kosong/salah
      notifications.error('Mohon lengkapi formulir dengan benar');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit Profil User' : 'Tambah User Baru'}
      width="900px" // Modal lebih lebar untuk menampung form lengkap
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* BAGIAN 1: AKUN & ALAMAT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Informasi Akun</h4>
            <Input 
              label="Nama Lengkap" 
              name="name" 
              icon={User} 
              value={formData.name} 
              onChange={handleChange} 
              error={errors.name}
              placeholder="Contoh: Budi Santoso"
              required 
            />
            <Input 
  label={
    <>
      Email <span style={{ color: 'var(--danger)' }}></span>
    </>
  }
  name="email"
  type="email"
  icon={Mail}
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  placeholder="Contoh: budi@gmail.com"
  required
/>

{emailWarning && (
  <div
    style={{
      marginTop: '-6px',
      marginBottom: '8px',
      textAlign: 'right',
      fontSize: '0.70rem',
      fontStyle: 'italic',
      color: 'var(--danger)'
    }}
  >
    {emailWarning}
  </div>
)}

            <Input 
              label={user ? "Password (Kosongkan jika tidak ganti)" : "Password"} 
              name="password" 
              type="password" 
              icon={Lock} 
              value={formData.password} 
              onChange={handleChange} 
              error={errors.password}
              placeholder={user ? "********" : "Minimal 6 karakter"}
              required={!user} 
            />
            
            <h4 style={{ color: 'var(--primary)', margin: '1rem 0 0.5rem' }}>Data Alamat</h4>
            <Input 
              label="Alamat KTP" 
              name="ktpAddress" 
              icon={MapPin} 
              value={formData.ktpAddress} 
              onChange={handleChange}
              placeholder="Contoh: Jl. Merdeka No. 123"
            />
            <Input 
              label="Alamat Lengkap Saat Ini" 
              name="currentAddress" 
              icon={MapPin} 
              value={formData.currentAddress} 
              onChange={handleChange}
              placeholder="Contoh: Jl. Sudirman Komp. Elite Blok A"
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-field">
                <label>Provinsi</label>
                <select name="provinsi" value={formData.provinsi} onChange={handleChange} className="custom-select">
                  <option value="" hidden>Pilih Provinsi</option>
                  {provinces.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="input-field">
                <label>Kabupaten/Kota</label>
                <select name="kabupaten" value={formData.kabupaten} onChange={handleChange} className="custom-select">
                  <option value="" hidden>Pilih Kabupaten</option>
                  {regencies.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="input-field">
              <label>Kecamatan</label>
              <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="custom-select">
                <option value="" hidden>Pilih Kecamatan</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>

          {/* BAGIAN 2: DATA PRIBADI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Kontak & Identitas</h4>
            <Input 
              label="No. Telepon" 
              name="phoneNumber" 
              icon={Phone} 
              value={formData.phoneNumber} 
              onChange={handleChange}
              placeholder="Contoh: 021-555555"
            />
            <Input 
              label="No. HP" 
              name="hpNumber" 
              icon={Phone} 
              value={formData.hpNumber} 
              onChange={handleChange} 
              error={errors.hpNumber}
              placeholder="Contoh: 081234567890"
              required 
            />
            
            <div className="input-field">
                <label>Kewarganegaraan</label>
                <select name="nationality" value={formData.nationality} onChange={handleChange} className="custom-select">
                  <option value="WNI Asli">WNI Asli</option>
                  <option value="WNI Keturunan">WNI Keturunan</option>
                  <option value="WNA">WNA</option>
                </select>
            </div>
            {formData.nationality === 'WNA' && (
              <Input 
                label="Sebutkan Negaranya" 
                name="nationalityName" 
                icon={Globe} 
                value={formData.nationalityName} 
                onChange={handleChange}
                placeholder="Contoh: Malaysia"
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input label="Tgl Lahir" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                <Input 
                  label="Tempat Lahir" 
                  name="birthPlace" 
                  value={formData.birthPlace} 
                  onChange={handleChange}
                  placeholder="Contoh: Bandung"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-field">
                    <label>Jenis Kelamin</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="custom-select">
                        <option value="Pria">Pria</option>
                        <option value="Wanita">Wanita</option>
                    </select>
                </div>
                <div className="input-field">
                    <label>Agama</label>
                    <select name="religion" value={formData.religion} onChange={handleChange} className="custom-select">
                        <option value="" hidden>Pilih Agama</option>
                        {/* Penjelasan: Menampilkan hanya 5 agama utama */}
                        {mainReligions.map(rel => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="input-field">
                <label>Status Menikah</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="custom-select">
                    <option value="Belum menikah">Belum menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Lain-lain">Lain-lain</option>
                </select>
            </div>

            <div className="input-field">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="custom-select">
                    <option value="ADMIN">ADMIN (Dealer)</option>
                    <option value="SALES">SALES Team</option>
                </select>
            </div>
          </div>
        </div>

        {user && (
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label className="switch">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              <span className="slider round"></span>
            </label>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Status Akun Aktif</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="secondary" onClick={onClose} type="button" style={{ flex: 1 }}>Batal</Button>
          <Button type="submit" loading={loading} style={{ flex: 1 }}>{user ? 'Simpan Perubahan' : 'Tambah User'}</Button>
        </div>
      </form>

      <style>{`
        .custom-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          outline: none;
          margin-top: 5px;
        }
        .custom-select option { background: #1e293b; color: white; }
        .input-field label { font-size: 0.825rem; color: var(--text-muted); }
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </Modal>
  );
};

export default UserModal;
