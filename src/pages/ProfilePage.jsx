import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, MapPin, Phone, Globe, Calendar, FileText, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import notifications from '../utils/notifications';
import { exportToPDF } from '../utils/pdfExport';

/**
 * Halaman Profile User
 * Menampilkan dan mengedit data profil user yang sedang login
 */
const ProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);

  // State untuk data referensi
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [religions, setReligions] = useState([]);

  // State untuk form edit
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    ktpAddress: '', currentAddress: '', kecamatan: '', kabupaten: '', provinsi: '',
    phoneNumber: '', hpNumber: '', nationality: 'WNI Asli', nationalityName: '',
    birthDate: '', birthPlace: '', gender: 'Pria', maritalStatus: 'Belum menikah', religion: ''
  });

  // Mengambil data user lengkap dari backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) return;

      setLoading(true);
      try {
        const res = await api.get(`/users/${authUser.id}`);
        const user = res.data;

        console.log('Fetched user data:', user); // Debug log

        setUserData(user);

        // Inisialisasi form dengan data user
        const initialFormData = {
          name: user.name || '',
          email: user.email || '',
          password: '', // Password tidak ditampilkan
          ktpAddress: user.ktpAddress || '',
          currentAddress: user.currentAddress || '',
          kecamatan: user.kecamatan || '',
          kabupaten: user.kabupaten || '',
          provinsi: user.provinsi || '',
          phoneNumber: user.phoneNumber || '',
          hpNumber: user.hpNumber || '',
          nationality: user.nationality || 'WNI Asli',
          nationalityName: user.nationalityName || '',
          birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
          birthPlace: user.birthPlace || '',
          gender: user.gender || 'Pria',
          maritalStatus: user.maritalStatus || 'Belum menikah',
          religion: user.religion || ''
        };

        console.log('Setting form data:', initialFormData); // Debug log
        setFormData(initialFormData);
      } catch (err) {
        console.error('Error fetching user:', err);
        notifications.error('Gagal memuat data profil');
      } finally {
        setLoading(false);
      }
    };

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

    fetchUserData();
    fetchReferences();
  }, [authUser]);

  // Fetch regencies when province changes
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
          setDistricts([]);
        } catch (err) {
          console.error('Gagal mengambil data kabupaten', err);
        }
      }
    };
    fetchRegencies();
  }, [formData.provinsi, provinces]);

  // Fetch districts when regency changes
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

  // State untuk warning format email (real-time)
  const [emailWarning, setEmailWarning] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi Nomor HP
    if (name === 'hpNumber' || name === 'phoneNumber') {
      if (value !== '' && !/^\d+$/.test(value)) {
        // notifications.error('Hanya boleh memasukkan angka!'); 
      }
    }

    // Validasi Real-time Email
    if (name === 'email') {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        setEmailWarning('Format email harus valid (contoh: user@example.com)');
      } else {
        setEmailWarning('');
      }
    }

    setFormData({ ...formData, [name]: value });

    // Clear error
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Error state
  const [errors, setErrors] = useState({});
  const mainReligions = ['Islam', 'Katolik', 'Kristen', 'Hindu', 'Budha'];

  // Validasi Form sebelum submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nama lengkap harus diisi';
    if (!formData.email) newErrors.email = 'Email harus diisi';
    if (!formData.hpNumber) newErrors.hpNumber = 'Nomor HP harus diisi';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek validasi
    if (!validateForm()) {
      notifications.error('Mohon periksa kembali formulir Anda');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/users/${authUser.id}`, formData);
      setUserData(res.data);
      notifications.success('Profil berhasil diperbarui');

      // Update context jika nama atau email berubah
      if (updateUser) {
        updateUser({ ...authUser, name: res.data.name, email: res.data.email });
      }
    } catch (err) {
      notifications.error(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (userData) {
      exportToPDF(userData);
      notifications.success('PDF berhasil diunduh');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header dengan tombol Export PDF */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Profil Saya</h1>
          <p style={{ color: 'var(--text-muted)' }}>Kelola informasi profil dan keamanan akun Anda</p>
        </div>
        <Button onClick={handleExportPDF} icon={Download}>
          Export PDF
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Kolom Kiri: Akun & Alamat */}
          <Card title="Informasi Akun & Alamat">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                label="Password Baru (Kosongkan jika tidak ingin mengubah)"
                name="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
              />

              <h4 style={{ color: 'var(--primary)', margin: '1rem 0 0.5rem' }}>Alamat</h4>
              <Input
                label="Alamat KTP"
                name="ktpAddress"
                icon={MapPin}
                value={formData.ktpAddress}
                onChange={handleChange}
                placeholder="Contoh: Jl. Merdeka No. 123"
              />
              <Input
                label="Alamat Domisili"
                name="currentAddress"
                icon={MapPin}
                value={formData.currentAddress}
                onChange={handleChange}
                placeholder="Contoh: Jl. Sudirman Komp. Elite Blok A"
              />

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
              <div className="input-field">
                <label>Kecamatan</label>
                <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} className="custom-select">
                  <option value="" hidden>Pilih Kecamatan</option>
                  {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {/* Kolom Kanan: Data Pribadi */}
          <Card title="Data Pribadi">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            </div>
          </Card>
        </div>

        {/* Tombol Simpan */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={saving} style={{ minWidth: '200px' }}>
            Simpan Perubahan
          </Button>
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
        .input-field label { font-size: 0.825rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem; }
      `}</style>
    </div>
  );
};

export default ProfilePage;
