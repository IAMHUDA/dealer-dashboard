// file: src/utils/pdfExport.js
// Penjelasan: File ini berisi logika untuk membuat dokumen PDF menggunakan jsPDF.
// Digunakan untuk mencetak bukti pendaftaran atau informasi user (Poin 7a).

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Fungsi untuk mengekspor data user ke format PDF.
 * @param {Object} userData - Data user yang akan dicetak
 */
export const exportToPDF = (userData) => {
  if (!userData) return;

  // Inisialisasi dokumen PDF (Format A4)
  const doc = new jsPDF();
  
  // 1. Header Dokumen
  doc.setFontSize(22);
  doc.setTextColor(99, 102, 241); // Warna Primary
  doc.text('DEALER PRO PREMIUM', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Bukti Pendaftaran Member', 105, 30, { align: 'center' });
  
  // Garis pemisah
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);

  // 2. Konten Data Diri (Menggunakan Tabel untuk kerapihan)
  const tableData = [
    ['Nama Lengkap', userData.name || '-'],
    ['Email', userData.email || '-'],
    ['Alamat KTP', userData.ktpAddress || '-'],
    ['Alamat Domisili', userData.currentAddress || '-'],
    ['Kecamatan', userData.kecamatan || '-'],
    ['Kabupaten', userData.kabupaten || '-'],
    ['Provinsi', userData.provinsi || '-'],
    ['Nomor Telepon', userData.phoneNumber || '-'],
    ['Nomor HP', userData.hpNumber || '-'],
    ['Kewarganegaraan', userData.nationality || '-'],
    ['Tempat, Tgl Lahir', `${userData.birthPlace || '-'}, ${userData.birthDate ? new Date(userData.birthDate).toLocaleDateString('id-ID') : '-'}`],
    ['Jenis Kelamin', userData.gender || '-'],
    ['Agama', userData.religion || '-'],
    ['Status Menikah', userData.maritalStatus || '-'],
  ];

  // Penjelasan: Menggunakan autoTable untuk membuat tabel data profil
  autoTable(doc, {
    startY: 45,
    head: [['Field', 'Informasi']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
  });

  // 3. Footer / Tanda Tangan
  const finalY = doc.lastAutoTable.finalY + 20;
  
  doc.setFontSize(10);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 20, finalY);
  
  doc.text('Tertanda,', 150, finalY);
  doc.text('Manajemen Dealer', 150, finalY + 30);

  // 4. Download File
  doc.save(`Bukti_Pendaftaran_${userData.name.replace(/\s+/g, '_')}.pdf`);
};
