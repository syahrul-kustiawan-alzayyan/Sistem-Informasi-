import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarDaftar from '../components/NavbarDaftar';
import { addMajelisTaklim } from '../redux/MajelisTaklimSlicer';
import { useDispatch } from 'react-redux';
import * as jwt_decode from 'jwt-decode';
import './formpendaftaran.css';

function FormPembaharuan() {
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  
  const [formData, setFormData] = useState({
    tanggal: '',
    namaPemohon: '',
    alamatPemohon: '',
    noHpPemohon: '',
    namaMajelis: '',
    alamatMajelis: '',
    kecamatan: '',
    kelurahan: '',
    namaPimpinan: '',
    noHpPimpinan: '',
    tahunBerdiri: '',
    jumlahJamaah: '',
    penyelenggara: '',
    suratPermohonan: null,
    rekomendasiKUA: null,
    susunanKepengurusan: null,
    suratDomisili: null,
    daftarJamaah: null,
    ktpPengurus: null,
    ktpJamaah: null,
    aktaYayasan: null,
    proposalPengajuan: null,
  });

  const dispatch = useDispatch()
  
  const [errors, setErrors] = useState({});

  const kelurahanList = { 
    "Banjarwangi": ["Banjarwangi", "Dangiang", "Gunamekar", "Kadongdong", "Talagasari", "Tanjungmulya", "Tegalpanjang", "Tegalgede"],
    "Banyuresmi": ["Bagendit", "Binakarya", "Cipicung", "Dangdeur", "Karyasari", "Sukasenang"],
    "Bayongbong": ["Ciela", "Cigedug", "Jangkurang", "Panembong", "Sindanggalih", "Sukarame"],
    "Limbangan": ["Caringin", "Ciwangi", "Karangmulya", "Mekarsari", "Pasawahan", "Purbayani", "Suc"],
    "Bungbulang": ["Cijayana", "Cipinang", "Gunungtanjung", "Hanjuang", "Jayamekar", "Mekarjaya"],
    "Caringin": ["Cibitung", "Mekarsari", "Padasuka", "Puspasari", "Sukamulya", "Sukasari"],
    "Cibalong": ["Cibalong", "Cikandang", "Karyamukti", "Mekarsari", "Simpang", "Sukabakti"],
    "Cibatu": ["Cibatu", "Cinta", "Keresek", "Mekargalih", "Mekarsari", "Padasuka", "Sukalilah", "Sukahurip"],
    "Cibiuk": ["Cibiuk Kaler", "Cibiuk Kidul", "Cipicung", "Cirapuhan", "Citalem", "Mekarmulya"],
    "Cigedug": ["Cigedug", "Cintanagara", "Sukalaksana", "Sukawangi", "Tegalmulya", "Wanakerta"],
    "Cihurip": ["Cihurip", "Karyamekar", "Mekarsari", "Sukanagara", "Tegallega"],
    "Cikajang": ["Cikajang", "Cikandang", "Mekarsari", "Mekarwangi", "Sukaluyu", "Sukasari"],
    "Cikelet": ["Cihikeu", "Cigintung", "Cikelet", "Cijambe", "Karamatwangi", "Mekarsari", "Neglasari"],
    "Cilawu": ["Cisandaan", "Sukajaya", "Sukaresmi", "Sukawangi", "Talaga", "Wanaraja"],
    "Cisewu": ["Cigadog", "Cisewu", "Girijaya", "Panyindangan", "Sukaresmi", "Tegallega"],
    "Cisompet": ["Cisompet", "Karyamekar", "Neglasari", "Sindangsari", "Sukarasa"],
    "Cisurupan": ["Cisurupan", "Cipancar", "Mekarsari", "Neglasari", "Sukarasa", "Sukawangi"],
    "Garut Kota": ["Ciwalen", "Paminggir", "Pakuwon", "Pataruman", "Regol", "Sukamentri", "Sukakarya", "Sukanegla"],
    "Kadungora": ["Cisarua", "Cinunuk", "Jatisari", "Kadungora", "Karangmulya", "Lembang", "Mandalawangi"],
    "Karangpawitan": ["Cinunuk", "Godog", "Jatisari", "Karangpawitan", "Mandalawangi", "Pasawahan", "Tegalgede"],
    "Karangtengah": ["Cipancar", "Mekarjaya", "Sukarame", "Talagasari"],
    "Kersamanah": ["Cicadas", "Cikelet", "Cisewu", "Mekarsari", "Neglasari", "Sindangsari", "Sukarame"],
    "Leles": ["Cikembulan", "Cikondang", "Cinagara", "Karangmulya", "Karangsari", "Mekarsari", "Sukamukti"],
    "Leuwigoong": ["Cikarag", "Lembursawah", "Mekarsari", "Sukajaya", "Sukaresmi"],
    "Malangbong": ["Caringin", "Ciwangi", "Karangpawitan", "Leuwigoong", "Pakenjeng", "Samarang"],
    "Mekarmukti": ["Cipancar", "Cisewu", "Girijaya", "Karangpawitan", "Sukajaya", "Tegalgede"],
    "Pakenjeng": ["Banjarwangi", "Cibatu", "Ciwangi", "Mekarsari", "Sukaluyu", "Tegallega"],
    "Pamengpeuk": ["Cisewu", "Girijaya", "Mekarsari", "Neglasari", "Sukarasa"],
    "Pamulihan": ["Cigedug", "Cikondang", "Karangmulya", "Tegalgede"],
    "Pangatikan": ["Banjarwangi", "Cibatu", "Mekarsari", "Sukakarya", "Sukarame"],
    "Pasirwangi": ["Caringin", "Karangmulya", "Sukaresmi", "Sukawangi"],
    "Peundeuy": ["Banjarwangi", "Cipancar", "Sukarame"],
    "Samarang": ["Cikondang", "Girijaya", "Neglasari", "Sukarasa"],
    "Selaawi": ["Girijaya", "Karangpawitan", "Mekarsari", "Sukarame"],
    "Singajaya": ["Banjarwangi", "Karangpawitan", "Sukajaya", "Tegalgede"],
    "Sucinaraja": ["Banjarwangi", "Ciwangi", "Sukajaya", "Sukarasa"],
    "Sukaresmi": ["Caringin", "Cikajang", "Karangpawitan", "Sukakarya"],
    "Sukawening": ["Caringin", "Ciwangi", "Sukaluyu", "Sukaresmi"],
    "Talegong": ["Cipancar", "Girijaya", "Sukaresmi", "Sukarasa"],
    "Tarogong Kaler": ["Cipancar", "Sukamanah", "Sukapura", "Tegalgede"],
    "Tarogong Kidul": ["Haurpanggung", "Jayawaras", "Kersamenak", "Pataruman", "Sukakarya"],
    "Wanaraja": ["Ciwalen", "Mekarsari", "Sukakarya"]
  };

  const kecamatanList = Object.keys(kelurahanList);

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showPopup = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => {
        setPopupMessage('');
        setPopupType('');
    }, 2000);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleKecamatanChange = (e) => {
    const selectedKecamatan = e.target.value;
    setFormData({
      ...formData,
      kecamatan: selectedKecamatan,
      kelurahan: '', // Reset kelurahan when kecamatan changes
    });
  };

  const handleKelurahanChange = (e) => {
    const selectedKelurahan = e.target.value;
    setFormData({
      ...formData,
      kelurahan: selectedKelurahan,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key === 'aktaYayasan') {
        // Skip validation for optional field
        return;
      }

      if (
        !formData[key] || 
        (typeof formData[key] === 'string' && formData[key].trim() === '') ||
        (formData[key] instanceof File && formData[key].size === 0)
      ) {
        newErrors[key] = 'Field ini harus diisi';
        isValid = false;
      }
    });

    setErrors(newErrors);
    setShowErrorMessage(!isValid);
    return isValid;
  };

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
      const formDataToSend = new FormData();

      const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;};
      
      console.log("Form data before sending:", formData);

      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
          console.log(`Appending file: ${key}, size: ${formData[key].size} bytes`);
        } else {
          formDataToSend.append(key, formData[key] || '');
          console.log(`Appending field: ${key}, value: ${formData[key] || ''}`);
        }
      });

      try {
        console.log("Sending request to server...");
        const token = getCookie('token');
        const response = await axios.post('http://localhost:3001/pengajuanpembaharuan', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        });
        
        console.log("Server response:", response.data);

        if (response.data.status === "sukses") {
          console.log("Data berhasil ditambahkan");
          dispatch(addMajelisTaklim(response.data.majelisTaklim));
          showPopup('Pendaftaran Berhasil!', 'success');
                setTimeout(() => {
                  navigate('/pendaftaran');
                }, 2000);
        } else {
          console.error("Data tidak berhasil ditambahkan:", response.data);
          setErrorMessage(`Gagal menambahkan data: ${response.data.message || 'Terjadi kesalahan pada server'}`);
          showPopup('Pendaftaran Gagal Silahkan cek kembali', 'error');
        }
      } catch (err) {
        console.error("Error details:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
          setErrorMessage(`Error ${err.response.status}: ${err.response.data.message || 'Terjadi kesalahan pada server'}`);
        } else if (err.request) {
          console.error("No response received:", err.request);
          setErrorMessage("Tidak ada respon dari server. Periksa koneksi internet Anda.");
        } else {
          console.error("Error setting up request:", err.message);
          setErrorMessage(`Terjadi kesalahan: ${err.message}`);
        }
      }
  };
  

    return (
      <>
        <NavbarDaftar />
        <Container className="pendaftaran-container">
          <h2 className="text-center">DAFTAR MAJELIS TAKLIM BARU</h2>
          {popupMessage && (
                <div className={`popup ${popupType}`} style={{
                    position: 'fixed',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px 30px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: '9999',
                    color: 'white',
                    textAlign: 'center',
                    backgroundColor: popupType === 'success' ? '#28a745' : '#dc3545',
                }}>
                    {popupMessage}
                </div>
            )}
          <Form onSubmit={handleSubmit}>
            
            <fieldset className="fieldset">
              <fieldset className="fieldset">
              <legend>IDENTITAS PEMOHON</legend>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="tanggal">
                    <Form.Label>Tanggal</Form.Label>
                    <Form.Control
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      isInvalid={!!errors.tanggal}
                    />
                    {errors.tanggal && <Form.Control.Feedback type="invalid">{errors.tanggal}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="namaPemohon">
                    <Form.Label>Nama Pemohon</Form.Label>
                    <Form.Control
                      type="text"
                      name="namaPemohon"
                      value={formData.namaPemohon}
                      onChange={handleInputChange}
                      isInvalid={!!errors.namaPemohon}
                    />
                    {errors.namaPemohon && <Form.Control.Feedback type="invalid">{errors.namaPemohon}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="alamatPemohon">
                <Form.Label>Alamat Lengkap</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="alamatPemohon"
                  value={formData.alamatPemohon}
                  onChange={handleInputChange}
                  isInvalid={!!errors.alamatPemohon}
                />
                {errors.alamatPemohon && <Form.Control.Feedback type="invalid">{errors.alamatPemohon}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="noHpPemohon">
                <Form.Label>No. Handphone</Form.Label>
                <Form.Control
                  type="text"
                  name="noHpPemohon"
                  value={formData.noHpPemohon}
                  onChange={handleInputChange}
                  isInvalid={!!errors.noHpPemohon}
                />
                {errors.noHpPemohon && <Form.Control.Feedback type="invalid">{errors.noHpPemohon}</Form.Control.Feedback>}
              </Form.Group>
            </fieldset>
            <fieldset className="fieldset">

              <legend>IDENTITAS PIMPINAN</legend>
              <Form.Group controlId="namaPimpinan">
                <Form.Label>Nama pimpinan</Form.Label>
                <Form.Control 
                  type="text"
                  name="namaPimpinan"
                  value={formData.namaPimpinan}
                  onChange={handleInputChange}
                  isInvalid={!!errors.namaPimpinan}
                />
                {errors.namaPimpinan && <Form.Control.Feedback type="invalid">{errors.namaPimpinan}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="NoHpPimpinan">
                <Form.Label>No Hp Pimpinan</Form.Label>
                <Form.Control 
                  type="text"
                  name="noHpPimpinan"
                  value={formData.noHpPimpinan}
                  onChange={handleInputChange}
                  isInvalid={!!errors.noHpPimpinan}
                />
                {errors.noHpPimpinan && <Form.Control.Feedback type="invalid">{errors.noHpPimpinan}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="tahunBerdiri">
                <Form.Label>Tahun Berdiri</Form.Label>
                <Form.Control 
                  type="text"
                  name="tahunBerdiri"
                  value={formData.tahunBerdiri}
                  onChange={handleInputChange}
                  isInvalid={!!errors.tahunBerdiri}
                />
                {errors.tahunBerdiri && <Form.Control.Feedback type="invalid">{errors.tahunBerdiri}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="jumlahJamaah">
                <Form.Label>Jumlah Jamaah</Form.Label>
                <Form.Control 
                  type="text"
                  name="jumlahJamaah"
                  value={formData.jumlahJamaah}
                  onChange={handleInputChange}
                  isInvalid={!!errors.jumlahJamaah}
                />
                {errors.jumlahJamaah && <Form.Control.Feedback type="invalid">{errors.jumlahJamaah}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="penyelenggara">
                <Form.Label>Penyelenggara</Form.Label>
                <Form.Control 
                  type="text"
                  name="penyelenggara"
                  value={formData.penyelenggara}
                  onChange={handleInputChange}
                  isInvalid={!!errors.penyelenggara}
                />
                {errors.penyelenggara && <Form.Control.Feedback type="invalid">{errors.penyelenggara}</Form.Control.Feedback>}
              </Form.Group>
              <legend>IDENTITAS MAJELIS TAKLIM</legend>
              <Form.Group controlId="namaMajelis">
                <Form.Label>Nama Majelis Taklim</Form.Label>
                <Form.Control 
                  type="text"
                  name="namaMajelis"
                  value={formData.namaMajelis}
                  onChange={handleInputChange}
                  isInvalid={!!errors.namaMajelis}
                />
                {errors.namaMajelis && <Form.Control.Feedback type="invalid">{errors.namaMajelis}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="alamatMajelis">
                <Form.Label>Alamat Lengkap</Form.Label>
                <Form.Control 
                  type="text"
                  name="alamatMajelis"
                  value={formData.alamatMajelis}
                  onChange={handleInputChange}
                  isInvalid={!!errors.alamatMajelis}
                />
                {errors.alamatMajelis && <Form.Control.Feedback type="invalid">{errors.alamatMajelis}</Form.Control.Feedback>}
              </Form.Group> 
              <Row>
                <Col md={6}>
                  <Form.Group controlId="kecamatan">
                    <Form.Label>Kecamatan</Form.Label>
                    <Form.Control
                      as="select"
                      name="kecamatan"
                      value={formData.kecamatan}
                      onChange={handleKecamatanChange}
                      isInvalid={!!errors.kecamatan}
                    >
                      <option value="">Pilih Kecamatan</option>
                      {kecamatanList.map((kecamatan) => (
                        <option key={kecamatan} value={kecamatan}>
                          {kecamatan}
                        </option>
                      ))}
                    </Form.Control>
                    {errors.kecamatan && (
                      <Form.Control.Feedback type="invalid">
                        {errors.kecamatan}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="kelurahan">
                    <Form.Label>Kelurahan</Form.Label>
                    <Form.Control
                      as="select"
                      name="kelurahan"
                      value={formData.kelurahan}
                      onChange={handleKelurahanChange}
                      disabled={!formData.kecamatan}
                      isInvalid={!!errors.kelurahan}
                    >
                      <option value="">Pilih Kelurahan</option>
                      {formData.kecamatan &&
                        kelurahanList[formData.kecamatan].map((kelurahan) => (
                          <option key={kelurahan} value={kelurahan}>
                            {kelurahan}
                          </option>
                        ))}
                    </Form.Control>
                    {errors.kelurahan && (
                      <Form.Control.Feedback type="invalid">
                        {errors.kelurahan}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              </fieldset>
            </fieldset>
            {/* ... (rest of the form remains the same) */}
            <fieldset className="fieldset">
              <legend>LAMPIRAN DOKUMEN</legend>
              <Form.Group controlId="suratPermohonan">
                <Form.Label>Surat Permohonan (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="suratPermohonan"
                    accept=".pdf"
                    onChange={handleFileChange}
                    isInvalid={!!errors.suratPermohonan}
                  />
                    {errors.suratPermohonan && <Form.Control.Feedback type="invalid">{errors.suratPermohonan}
                  </Form.Control.Feedback>}
              </Form.Group>
                <Form.Group controlId="rekomendasiKUA">
                  <Form.Label>Rekomendasi KUA</Form.Label>
                  <Form.Control
                    type="file"
                    name="rekomendasiKUA"
                    accept=".pdf"
                    onChange={handleFileChange}
                    isInvalid={!!errors.rekomendasiKUA}
                    />
                    {errors.rekomendasiKUA && <Form.Control.Feedback type="invalid">{errors.rekomendasiKUA}
                  </Form.Control.Feedback>}
              </Form.Group>
            <Form.Group controlId="susunanKepengurusan">
              <Form.Label>Susunan Kepengurusan (PDF)</Form.Label>
              <Form.Control
                type="file"
                name="susunanKepengurusan"
                accept=".pdf"
                onChange={handleFileChange}
                isInvalid={!!errors.susunanKepengurusan}
              />
              {errors.susunanKepengurusan && <Form.Control.Feedback type="invalid">{errors.susunanKepengurusan}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="suratDomisili">
              <Form.Label>Surat Domisili dari kepala desa</Form.Label>
              <Form.Control
                type="file"
                name="suratDomisili"
                accept=".pdf"
                onChange={handleFileChange}
                isInvalid={!!errors.suratDomisili}
              />
              {errors.suratDomisili && <Form.Control.Feedback type="invalid">{errors.suratDomisili}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="daftarJamaah">
              <Form.Label>Daftar Jemaah</Form.Label>
              <Form.Control
                type="file"
                name="daftarJamaah"
                accept=".pdf"
                onChange={handleFileChange}
                isInvalid={!!errors.daftarJamaah}
              />
              {errors.daftarJamaah && <Form.Control.Feedback type="invalid">{errors.daftarJamaah}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="ktpPengurus">
              <Form.Label>KTP Pengurus</Form.Label>
              <Form.Control
                type="file"
                name="ktpPengurus"
                accept=".pdf"
                onChange={handleFileChange}
                isInvalid={!!errors.ktpPengurus}
              />
              {errors.ktpPengurus && <Form.Control.Feedback type="invalid">{errors.ktpPengurus}</Form.Control.Feedback>}
            </Form.Group>
              <Form.Group controlId="ktpJamaah">
                <Form.Label>Fotocopy KTP Jamaah (Minimal 15 Orang) (PDF)</Form.Label>
                <Form.Control
                  type="file"
                  name="ktpJamaah"
                  accept=".pdf"
                  onChange={handleFileChange}
                  isInvalid={!!errors.ktpJamaah}
                />
                {errors.ktpJamaah && <Form.Control.Feedback type="invalid">{errors.ktpJamaah}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group controlId="aktaYayasan">
                <Form.Label>Fotocopy Akta Yayasan dan SK Menkumham (Jika Penyelenggara Yayasan) (PDF)</Form.Label>
                <Form.Control
                  type="file"
                  name="aktaYayasan"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group controlId="proposalPengajuan">
                <Form.Label>Proposal Pengajuan (PDF)</Form.Label>
                <Form.Control
                  type="file"
                  name="proposalPengajuan"
                  accept=".pdf"
                  onChange={handleFileChange}
                  isInvalid={!!errors.proposalPengajuan}
                />
                {errors.proposalPengajuan && <Form.Control.Feedback type="invalid">{errors.proposalPengajuan}</Form.Control.Feedback>}
              </Form.Group>
            </fieldset>
          
            <Button variant="primary" type="submit">
            Daftar
            </Button>
          </Form>
        </Container>
      </>
    );
}

export default FormPembaharuan;