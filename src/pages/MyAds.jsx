import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Plus, Trash2, Edit3, PlayCircle, X } from 'lucide-react';
import api from '../utils/api';
import notifications from '../utils/notifications';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

import { useAuth } from '../context/AuthContext'; // Tambah import ini

/**
 * Halaman Iklan Saya
 * Menangani CRUD Video Iklan untuk pengguna yang sedang login.
 */
const MyAds = () => {
  const { user, isAdmin } = useAuth(); // Ambil data user login
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({ title: '', videoFile: null });

  // Penjelasan: Mengambil data video dari backend saat halaman dibuka
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/videos');
      setVideos(res.data);
    } catch (err) {
      notifications.error('Gagal memuat video iklan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Penjelasan: Menangani submit form dengan upload file video
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi: Untuk video baru, file wajib ada
    if (!editingVideo && !formData.videoFile) {
      notifications.error('File video wajib diupload');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      if (formData.videoFile) {
        data.append('video', formData.videoFile);
      }

      if (editingVideo) {
        await api.put(`/videos/${editingVideo.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        notifications.success('Video berhasil diperbarui');
      } else {
        await api.post('/videos', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        notifications.success('Video berhasil ditambahkan');
      }
      setShowModal(false);
      setEditingVideo(null);
      setFormData({ title: '', videoFile: null });
      fetchVideos();
    } catch (err) {
      notifications.error(err.response?.data?.message || 'Gagal menyimpan video');
    }
  };

  // Penjelasan: Menangani penghapusan video dengan konfirmasi
  const handleDelete = async (id) => {
    const confirmed = await notifications.confirm('Hapus Video?', 'Video ini akan dihapus dari iklan Anda.');
    if (confirmed) {
      try {
        await api.delete(`/videos/${id}`);
        notifications.success('Video berhasil dihapus');
        fetchVideos();
      } catch (err) {
        notifications.error('Gagal menghapus video');
      }
    }
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    setFormData({ title: video.title, videoFile: null });
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Iklan Saya</h1>
          <p style={{ color: 'var(--text-muted)' }}>Kelola konten video promosi unit motor Anda</p>
        </div>
        <Button onClick={() => { setEditingVideo(null); setFormData({ title: '', videoFile: null }); setShowModal(true); }}>
          <Plus size={18} /> Tambah Video Baru
        </Button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {videos.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
              <Film size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
              <p>Belum ada video iklan. Klik tombol "Tambah Video Baru" untuk memulai.</p>
            </div>
          ) : (
            videos.map(video => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card"
                style={{ overflow: 'hidden', padding: '0' }}
              >
                {/* Preview Video Player - HTML5 Video */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                  <video
                    width="100%"
                    height="100%"
                    controls
                    style={{ objectFit: 'contain' }}
                  >
                    <source src={`http://localhost:3000/${video.videoUrl}`} type="video/mp4" />
                    Browser Anda tidak mendukung tag video.
                  </video>
                </div>
                
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{video.title}</h3>
                  {/* Penjelasan: Menampilkan nama pengunggah agar Sales tahu video mana yang milik Dealer */}
                  {video.user && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Oleh: {video.user.name} {video.user.role === 'ADMIN' ? '(Dealer)' : ''}
                    </p>
                  )}
                  
                  {/* Penjelasan: Hanya tampilkan tombol Edit/Hapus jika user adalah ADMIN atau pemilik video */}
                  {(isAdmin || video.userId === user?.id) && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <Button 
                        variant="secondary" 
                        style={{ flex: 1, padding: '0.5rem' }} 
                        onClick={() => openEditModal(video)}
                      >
                        <Edit3 size={16} /> Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        style={{ flex: 1, padding: '0.5rem' }} 
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 size={16} /> Hapus
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* MODAL TAMBAH/EDIT VIDEO */}
      {showModal && (
        <div className="modal-backdrop">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card" 
            style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {editingVideo ? 'Edit Judul Iklan' : 'Tambah Video Iklan Baru'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                label="Judul Video"
                placeholder="Masukkan judul iklan Anda"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              
              {/* Input File Video */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  File Video {editingVideo ? '(Opsional - kosongkan jika tidak ingin mengubah)' : ''}
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/avi,video/quicktime"
                  onChange={(e) => setFormData({ ...formData, videoFile: e.target.files[0] })}
                  required={!editingVideo}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Format: MP4, WebM, OGG, AVI, MOV (Maks. 100MB)
                </p>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  style={{ flex: 1 }} 
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </Button>
                <Button type="submit" style={{ flex: 1 }}>
                  {editingVideo ? 'Simpan Perubahan' : 'Tambah Video'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MyAds;
