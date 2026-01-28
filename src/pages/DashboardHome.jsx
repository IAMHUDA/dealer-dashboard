import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Bike, 
  TrendingUp, 
  Plus,
  ArrowRight,
  FileText,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import Card from '../components/common/Card';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import notifications from '../utils/notifications';
import { exportToPDF } from '../utils/pdfExport'; // Import utilitas ekspor PDF baru

/**
 * Komponen Dashboard Utama (Home)
 * Menampilkan statistik, unit motor terbaru, video iklan, dan fitur ekspor PDF.
 */
const DashboardHome = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalMotors: 0,
    totalUsers: 0,
    availableMotors: 0,
    salesCount: 0
  });
  const [latestMotors, setLatestMotors] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Penjelasan: Mengambil data statistik dan konten multimedia dari backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [motorsRes, usersRes, videosRes] = await Promise.all([
          api.get('/motors'),
          isAdmin ? api.get('/users') : Promise.resolve({ data: [] }),
          api.get('/videos')
        ]);
        
        const motors = motorsRes.data;
        const users = usersRes.data;
        const videos = videosRes.data;

        setStats({
          totalMotors: motors.length,
          totalUsers: users.length,
          availableMotors: motors.filter(m => m.status === 'AVAILABLE').length,
          salesCount: users.filter(u => u.role === 'SALES').length
        });

        // Ambil 3 data terbaru untuk ditampilkan di dashboard
        setLatestMotors(motors.slice(0, 3));
        setLatestVideos(videos.slice(0, 2));
      } catch (error) {
        console.error('Gagal memuat data dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [isAdmin]);

  // Penjelasan: Menangani ekspor bukti pendaftaran ke format PDF (Poin 7a)
  const handleExportPDF = () => {
    notifications.success('Menyiapkan dokumen PDF...');
    exportToPDF(user); // Memanggil fungsi ekspor dengan data user yang sedang login
  };

  const statCards = [
    { title: 'Total Motor', value: stats.totalMotors, icon: Bike, color: '#6366f1' },
    { title: 'Tersedia', value: stats.availableMotors, icon: TrendingUp, color: '#22c55e' },
  ];

  if (isAdmin) {
    statCards.push(
      { title: 'Total User', value: stats.totalUsers, icon: Users, color: '#ec4899' },
      { title: 'Tim Sales', value: stats.salesCount, icon: Users, color: '#f59e0b' }
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Baris Statistik Utama */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`, 
        gap: '1.5rem',
      }}>
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>{stat.title}</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{stat.value}</h3>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Kolom Multimedia & Iklan (Poin 5) */}
        <Card title="Multimedia & Iklan Terbaru" subtitle="Video promosi unit dealer">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
             {latestVideos.length > 0 ? (
               latestVideos.map(video => (
                 <div key={video.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <div style={{ width: '80px', height: '45px', backgroundColor: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                      <Film size={20} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>{video.title}</p>
                      {/* Penjelasan: Menunjukkan bahwa video diinput oleh Dealer */}
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        Oleh: {video.user?.name} {video.user?.role === 'ADMIN' ? '(Dealer)' : ''}
                      </p>
                    </div>
                    <ArrowRight size={16} color="var(--text-muted)" />
                 </div>
               ))
             ) : (
               <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Belum ada video iklan</p>
             )}
           </div>
        </Card>

        {/* Kolom Aksi Cepat & Ekspor (Poin 7a) */}
        <Card title="Aksi & Laporan" subtitle="Fitur manajemen dan cetak dokumen">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {/* Tombol Ekspor PDF (Poin 7a) */}
            <button 
              onClick={handleExportPDF}
              className="action-btn"
              style={{ borderColor: 'var(--primary)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FileText size={20} color="var(--primary)" />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: '600' }}>Cetak Bukti Pendaftaran</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ekspor data profil ke format PDF</span>
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </button>

            <button className="action-btn" style={{ borderColor: 'var(--secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ImageIcon size={20} color="var(--secondary)" />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontWeight: '600' }}>Galeri Gambar</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lihat semua foto unit motor</span>
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </button>
          </div>
        </Card>
      </div>

      <style>{`
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background-color: var(--dark-light);
          border: 1px solid var(--glass-border);
          borderRadius: var(--radius-sm);
          color: white;
          cursor: pointer;
          transition: var(--transition);
          width: 100%;
        }
        .action-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;
