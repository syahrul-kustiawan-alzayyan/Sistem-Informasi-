const express = require('express');
const multer = require('multer');
const MajelisTaklimBaru = require('../models/formBaru');
const router = express.Router();

// Konfigurasi multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Route untuk pendaftaran baru
router.post('/baru', upload.fields([
  { name: 'suratPermohonan', maxCount: 1 },
  { name: 'rekomendasiKUA', maxCount: 1 },
  { name: 'susunanKepengurusan', maxCount: 1 },
  { name: 'suratDomisili', maxCount: 1 },
  { name: 'daftarJamaah', maxCount: 1 },
  { name: 'ktpPengurus', maxCount: 1 },
  { name: 'ktpJamaah', maxCount: 1 },
  { name: 'aktaYayasan', maxCount: 1 },
  { name: 'proposalPengajuan', maxCount: 1 }
]), async (req, res) => {
  try {
    const formData = req.body;
    const fileData = req.files;

    console.log("File Data: ", fileData); // Untuk debugging
    console.log("Form Data: ", formData);

    // Pastikan setiap file dicek keberadaannya sebelum diakses
    const majelisTaklimBaru = new MajelisTaklimBaru({
      tanggal: formData.tanggal,
      namaPemohon: formData.namaPemohon,
      alamatPemohon: formData.alamatPemohon,
      noHpPemohon: formData.noHpPemohon,
      namaMajelis: formData.namaMajelis,
      alamatMajelis: formData.alamatMajelis,
      kecamatan: formData.kecamatan,
      kelurahan: formData.kelurahan,
      namaPimpinan: formData.namaPimpinan,
      noHpPimpinan: formData.noHpPimpinan,
      tahunBerdiri: formData.tahunBerdiri,
      jumlahJamaah: formData.jumlahJamaah,
      penyelenggara: formData.penyelenggara,
      // Gunakan ternary untuk file yang wajib dan opsional
      suratPermohonan: fileData.suratPermohonan ? fileData.suratPermohonan[0].filename : null,
      rekomendasiKUA: fileData.rekomendasiKUA ? fileData.rekomendasiKUA[0].filename : null,
      susunanKepengurusan: fileData.susunanKepengurusan ? fileData.susunanKepengurusan[0].filename : null,
      suratDomisili: fileData.suratDomisili ? fileData.suratDomisili[0].filename : null,
      daftarJamaah: fileData.daftarJamaah ? fileData.daftarJamaah[0].filename : null,
      ktpPengurus: fileData.ktpPengurus ? fileData.ktpPengurus[0].filename : null,
      ktpJamaah: fileData.ktpJamaah ? fileData.ktpJamaah[0].filename : null,
      aktaYayasan: fileData.aktaYayasan ? fileData.aktaYayasan[0].filename : null,
      proposalPengajuan: fileData.proposalPengajuan ? fileData.proposalPengajuan[0].filename : null
    });

    // Simpan ke database
    await majelisTaklimBaru.save();
    res.status(201).json({ message: 'Pendaftaran berhasil!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
  }
});

module.exports = router;
