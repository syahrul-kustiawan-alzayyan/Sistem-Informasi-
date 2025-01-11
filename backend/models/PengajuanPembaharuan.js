const mongoose = require('mongoose');

const PengajuanPembaharuanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tanggal: { type: Date, required: true },
  namaPemohon: { type: String, required: true },
  alamatPemohon: { type: String, required: true },
  noHpPemohon: { type: String, required: true },
  namaMajelis: { type: String, required: true },
  alamatMajelis: { type: String, required: true },
  kecamatan: { type: String, required: true },
  kelurahan: { type: String, required: true },
  namaPimpinan: { type: String, required: true },
  noHpPimpinan: { type: String, required: true },
  tahunBerdiri: { type: Number, required: true },
  jumlahJamaah: { type: Number, required: true },
  penyelenggara: { type: String, required: true },
  suratPermohonan: { type: String, required: true },
  rekomendasiKUA: { type: String, required: true },
  susunanKepengurusan: { type: String, required: true },
  suratDomisili: { type: String, required: true },
  daftarJamaah: { type: String, required: true },
  ktpPengurus: { type: String, required: true },
  ktpJamaah: { type: String, required: true },
  aktaYayasan: { type: String, required: false },  // Made optional
  proposalPengajuan: { type: String, required: true },
  status: { type: String, enum: ['pending', 'disetujui', 'ditolak'], default: 'pending' },
  pesanPenolakan: { type: String, default: '' },
});

const PengajuanPembaharuanModel = mongoose.model('Pengajuanpembaharuan', PengajuanPembaharuanSchema);
module.exports = PengajuanPembaharuanModel;