import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Bike, ArrowRight, MapPin, Phone, Globe, Calendar, Users, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import notifications from '../utils/notifications';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

/**
 * Komponen Halaman Login & Registrasi
 * Menangani proses masuk dan pendaftaran user baru dengan form yang lengkap.
 */
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // State untuk menyimpan data formulir (semua field dari gambar pendaftaran)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    ktpAddress: '',
    currentAddress: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    phoneNumber: '',
    hpNumber: '',
    nationality: 'WNI Asli', // Default value
    nationalityName: '',
    birthDate: '',
    birthPlace: '',
    gender: 'Pria',
    maritalStatus: 'Belum menikah',
    religion: ''
  });

  // State untuk data referensi dari database (Poin 3a)
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]); // State baru untuk Kecamatan
  const [religions, setReligions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Mengambil data referensi saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const [provRes, relRes] = await Promise.all([
          api.get('/references/provinces'),
          api.get('/references/religions')
        ]);
        setProvinces(provRes.data);
        setReligions(relRes.data);
      } catch (err) {
        console.error('Gagal mengambil data referensi', err);
      }
    };
    fetchReferences();
  }, []);

  // Mengambil data kabupaten ketika provinsi dipilih
  useEffect(() => {
    const fetchRegencies = async () => {
      if (!formData.provinsi) {
        setRegencies([]);
        return;
      }
      const selectedProv = provinces.find(p => p.name === formData.provinsi);
      if (selectedProv) {
        try {
          const res = await api.get(`/references/regencies/${selectedProv.id}`);
          setRegencies(res.data);
          setDistricts([]); // Reset kecamatan saat ganti kabupaten
        } catch (err) {
          console.error('Gagal mengambil data kabupaten', err);
        }
      }
    };
    fetchRegencies();
  }, [formData.provinsi, provinces]);

  // Penjelasan: Mengambil data kecamatan ketika kabupaten dipilih (Tambahan)
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.kabupaten) {
        setDistricts([]);
        return;
      }
      const selectedReg = regencies.find(r => r.name === formData.kabupaten);
      if (selectedReg) {
        try {
          const res = await api.get(`/references/districts/${selectedReg.id}`);
          setDistricts(res.data);
        } catch (err) {
          console.error('Gagal mengambil data kecamatan', err);
        }
      }
    };
    fetchDistricts();
  }, [formData.kabupaten, regencies]);

  /**
   * Menangani perubahan input form
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validasi Nomor HP harus berupa angka (Poin 3c) menggunakan JavaScript
    if (name === 'hpNumber' || name === 'phoneNumber') {
      if (value !== '' && !/^\d+$/.test(value)) {
        notifications.error('Nomor harus berupa format angka!');
        return; // Jangan update state jika bukan angka
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Validasi Manual sebelum Submit (Poin 3b & 6)
   */
  const validateForm = () => {
    // Validasi Format Email (Poin 3b)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      notifications.alert('Input Tidak Sesuai', 'Format email yang Anda masukkan tidak valid!', 'error');
      return false;
    }

    // Validasi HP harus diisi (Poin 3c & 6)
    if (!formData.hpNumber) {
      notifications.alert('Input Tidak Sesuai', 'Nomor HP wajib diisi dengan angka!', 'error');
      return false;
    }

    return true;
  };

  /**
   * Menangani pengiriman form (Login atau Register)
   */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isLogin && !validateForm()) return;

  setLoading(true);
  try {
    const res = isLogin
      ? await login(formData.email, formData.password)
      : await register(formData);

    if (res.success) {

      // 👉 JIKA REGISTER
      if (!isLogin) {
        notifications.success(
          'Register berhasil, silahkan masukkan email dan password yang sudah Anda buat'
        );

        setIsLogin(true); // balik ke halaman login
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
        return;
      }

      // 👉 JIKA LOGIN
      notifications.success('Selamat datang kembali!');
      navigate('/');

    } else {
      notifications.error(res.message);
    }
  } catch (err) {
    notifications.error('Terjadi kesalahan sistem');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #312e81, #0f172a)',
      padding: '2rem 1.5rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: isLogin ? '450px' : '900px' }} // Form register lebih lebar
      >
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
            }}>
              <Bike size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {isLogin ? 'Masuk ke Dashboard' : 'Formulir Pendaftaran Member'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {isLogin ? 'Silakan masuk untuk mengelola data dealer' : 'Lengkapi data diri Anda sesuai dengan identitas resmi'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isLogin ? (
              // FORM LOGIN (SEDERHANA)
              <>
                <Input
                  label="Alamat Email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Kata Sandi"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </>
            ) : (
              // FORM REGISTER (LENGKAP SESUAI GAMBAR)
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Kolom Kiri: Akun & Lokasi */}
                <div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1rem' }}>Informasi Akun</h3>
                  <Input label="Nama Lengkap" name="name" icon={User} value={formData.name} onChange={handleChange} required />
                  <Input label="Email" name="email" type="email" icon={Mail} value={formData.email} onChange={handleChange} required />
                  <Input label="Password" name="password" type="password" icon={Lock} value={formData.password} onChange={handleChange} required />
                  
                  <h3 style={{ margin: '1.5rem 0 1rem', color: 'var(--primary)', fontSize: '1rem' }}>Data Alamat</h3>
                  <Input label="Alamat KTP" name="ktpAddress" icon={MapPin} value={formData.ktpAddress} onChange={handleChange} />
                  <Input label="Alamat Domisili" name="currentAddress" icon={MapPin} value={formData.currentAddress} onChange={handleChange} />
                  
                  {/* Pilihan Lokasi Cascading (Poin 3a & Tambahan Kecamatan) */}
                  <div className="input-group">
                    <label>Provinsi</label>
                    <select name="provinsi" value={formData.provinsi} onChange={handleChange} className="form-select">
                      <option value="">Pilih Provinsi</option>
                      {provinces.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Kabupaten/Kota</label>
                    <select name="kabupaten" value={formData.kabupaten} onChange={handleChange} className="form-select">
                      <option value="">Pilih Kabupaten</option>
                      {regencies.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Kecamatan</label>
                    <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="form-select">
                      <option value="">Pilih Kecamatan</option>
                      {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Kolom Kanan: Identitas & Kontak */}
                <div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', fontSize: '1rem' }}>Kontak & Identitas</h3>
                  <Input label="Nomor Telepon" name="phoneNumber" icon={Phone} value={formData.phoneNumber} onChange={handleChange} placeholder="Contoh: 021..." />
                  <Input label="Nomor HP" name="hpNumber" icon={Phone} value={formData.hpNumber} onChange={handleChange} placeholder="Contoh: 081..." required />
                  
                  <div className="input-group">
                    <label>Kewarganegaraan</label>
                    <select name="nationality" value={formData.nationality} onChange={handleChange} className="form-select">
                      <option value="WNI Asli">WNI Asli</option>
                      <option value="WNI Keturunan">WNI Keturunan</option>
                      <option value="WNA">WNA</option>
                    </select>
                  </div>
                  {formData.nationality === 'WNA' && (
                    <Input label="Sebutkan Negaranya" name="nationalityName" icon={Globe} value={formData.nationalityName} onChange={handleChange} />
                  )}

                  <Input label="Tanggal Lahir" name="birthDate" type="date" icon={Calendar} value={formData.birthDate} onChange={handleChange} />
                  <Input label="Tempat Lahir" name="birthPlace" value={formData.birthPlace} onChange={handleChange} />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                      <label>Jenis Kelamin</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                        <option value="Pria">Pria</option>
                        <option value="Wanita">Wanita</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Agama</label>
                      <select name="religion" value={formData.religion} onChange={handleChange} className="form-select">
                        <option value="">Pilih Agama</option>
                        {religions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Status Menikah</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="form-select">
                      <option value="Belum menikah">Belum menikah</option>
                      <option value="Menikah">Menikah</option>
                      <option value="Lain-lain">Lain-lain (Janda/Duda)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              style={{ width: '100%', marginTop: '2rem' }}
            >
              {isLogin ? 'Masuk Sekarang' : 'Daftar Sebagai Member'}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              {isLogin ? 'Daftar' : 'Kembali Login'}
            </button>
          </p>
        </div>
      </motion.div>

      {/* Style tambahan untuk select dropdown agar seragam dengan Input component */}
      <style>{`
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          outline: none;
          margin-top: 0.5rem;
          transition: border-color 0.2s;
        }
        .form-select option {
          background: #1e293b;
          color: white;
        }
        .form-select:focus {
          border-color: var(--primary);
        }
        .input-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
