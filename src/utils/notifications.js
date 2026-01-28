import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Custom theme for SweetAlert2 to match the dashboard look
const toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1e293b',
  color: '#f8fafc',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const notifySuccess = (message) => {
  toast.fire({
    icon: 'success',
    title: message
  });
};

export const notifyError = (message) => {
  toast.fire({
    icon: 'error',
    title: message || 'Terjadi kesalahan'
  });
};

/**
 * Fungsi konfirmasi untuk tindakan berbahaya atau penting.
 * @param {string} title - Judul modal
 * @param {string} text - Pesan tambahan
 * @param {string} confirmText - Teks tombol konfirmasi (Opsional)
 */
export const confirmDelete = async (title, text, confirmText = 'Ya, hapus!') => {
  const result = await MySwal.fire({
    title: title || 'Apakah Anda yakin?',
    text: text || 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#ef4444',
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    background: '#0f172a',
    color: '#f8fafc',
    backdrop: `rgba(15, 23, 42, 0.7)`
  });
  return result.isConfirmed;
};

export const showAlert = (title, text, icon = 'info') => {
  MySwal.fire({
    title,
    text,
    icon,
    background: '#0f172a',
    color: '#f8fafc',
    confirmButtonColor: '#6366f1',
  });
};

export default {
  success: notifySuccess,
  error: notifyError,
  confirm: confirmDelete,
  alert: showAlert
};
