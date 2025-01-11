const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const formbarumodel = require('../models/formBaru');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/submit-form', upload.fields([
  { name: 'suratPermohonan', maxCount: 1 },
  { name: 'rekomendasiKUA', maxCount: 1 },
  { name: 'susunanKepengurusan', maxCount: 1 },
  { name: 'suratDomisili', maxCount: 1 },
  { name: 'daftarJamaah', maxCount: 1 },
  { name: 'ktpPengurus', maxCount: 1 },
  { name: 'ktpJamaah', maxCount: 1 },
  { name: 'aktaYayasan', maxCount: 1 },
  { name: 'proposalPengajuan', maxCount: 1 },
  { name: 'suratketeranganterdaftar', maxCount: 1 },
]), async (req, res) => {
  try {
    const formData = req.body;
    
    // Add file paths to formData
    for (const field in req.files) {
      formData[field] = req.files[field][0].path;
    }

    const newForm = new formbarumodel(formData);
    await newForm.save();

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting form' });
  }
});

module.exports = router;