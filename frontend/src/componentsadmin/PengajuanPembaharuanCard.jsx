import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchPengajuanPembaharuan, removePengajuanPembaharuan } from '../redux/PengajuanPembaharuanSlicer';
import { Modal, Button, Form } from 'react-bootstrap';


const PengajuanPembaharuanCard = () => {
  const dispatch = useDispatch();
  const PengajuanPembaharuan = useSelector((state) => state.PengajuanPembaharuan.PengajuanPembaharuan);

  const [showModal, setShowModal] = useState(false);
  const [selectedPengajuanPembaharuan, setSelectedPengajuanPembaharuan] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // State for notification modal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationVariant, setNotificationVariant] = useState(''); // 'success' or 'danger'

  const [searchTerm, setSearchTerm] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterKelurahan, setFilterKelurahan] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/pengajuanpembaharuan');
        dispatch(fetchPengajuanPembaharuan(response.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleShowModal = (PengajuanPembaharuan) => {
    setSelectedPengajuanPembaharuan(PengajuanPembaharuan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPengajuanPembaharuan(null);
  };

  const handleReject = async () => {
    try {
      await axios.delete(`http://localhost:3001/pengajuanpembaharuan/${selectedPengajuanPembaharuan._id}`, {
        data: { reason: rejectionReason },
      });
      setNotificationMessage('Data berhasil ditolak!');
      setNotificationVariant('danger');
      setShowNotification(true);

      setTimeout(() => {
        setShowModal(false);
        setShowRejectionModal(false);
        setShowNotification(false);
        dispatch(removePengajuanPembaharuan(selectedPengajuanPembaharuan._id));
        setRejectionReason('');
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Error rejecting data:', err);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/majelistaklim',
        selectedPengajuanPembaharuan
      );
      if (response.status === 200) {
        setNotificationMessage('Data berhasil dipindahkan ke Majelis Taklim!');
        setNotificationVariant('success');
        setShowNotification(true);

        setTimeout(() => {
          setShowModal(false);
          setShowNotification(false);
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.error('Error approving data:', err);
      setNotificationMessage('Gagal memindahkan data ke Majelis Taklim!');
      setNotificationVariant('danger');
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  // Filter and Search Logic
  const filteredPengajuanPembaharuan = PengajuanPembaharuan.filter((item) => {
    return (
      item.namaMajelis.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterKecamatan || item.kecamatan === filterKecamatan) &&
      (!filterKelurahan || item.kelurahan === filterKelurahan)
    );
  });

  // Extract unique kecamatan and kelurahan for filters
  const uniqueKecamatan = [...new Set(PengajuanPembaharuan.map((item) => item.kecamatan))];
  const uniqueKelurahan = [...new Set(PengajuanPembaharuan.map((item) => item.kelurahan))];

  return (
    <>
      <div className="filter-container">
        <Form.Control
          type="text"
          placeholder="Cari nama majelis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-item"
        />

        <Form.Select
          className="filter-item"
          value={filterKecamatan}
          onChange={(e) => setFilterKecamatan(e.target.value)}
        >
          <option value="">Filter Kecamatan</option>
          {uniqueKecamatan.map((kecamatan, index) => (
            <option key={index} value={kecamatan}>
              {kecamatan}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className="filter-item"
          value={filterKelurahan}
          onChange={(e) => setFilterKelurahan(e.target.value)}
        >
          <option value="">Filter Kelurahan</option>
          {uniqueKelurahan.map((kelurahan, index) => (
            <option key={index} value={kelurahan}>
              {kelurahan}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className="card-container">
        {filteredPengajuanPembaharuan.map((item, index) => (
          <div
            className="majelis-card"
            key={index}
            onClick={() => handleShowModal(item)}
          >
            <div className="card-header" style={{backgroundColor:"#033c1a"}}>
              <h5>{item.namaMajelis}</h5>
            </div>
            <div className="card-body">
              <p><strong>Kecamatan:</strong> {item.kecamatan}</p>
              <p><strong>Kelurahan:</strong> {item.kelurahan}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Majelis Taklim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPengajuanPembaharuan && (
            <>
              <div className="detail-container">
                <p><strong>Tanggal:</strong> {new Date(selectedPengajuanPembaharuan.tanggal).toLocaleDateString()}</p>
                <p><strong>Nama Pemohon:</strong> {selectedPengajuanPembaharuan.namaPemohon}</p>
                <p><strong>Alamat Pemohon:</strong> {selectedPengajuanPembaharuan.alamatPemohon}</p>
                <p><strong>No. HP Pemohon:</strong> {selectedPengajuanPembaharuan.noHpPemohon}</p>
                <p><strong>Nama Majelis:</strong> {selectedPengajuanPembaharuan.namaMajelis}</p>
                <p><strong>Alamat Majelis:</strong> {selectedPengajuanPembaharuan.alamatMajelis}</p>
                <p><strong>Kecamatan:</strong> {selectedPengajuanPembaharuan.kecamatan}</p>
                <p><strong>Kelurahan:</strong> {selectedPengajuanPembaharuan.kelurahan}</p>
                <p><strong>Nama Pimpinan:</strong> {selectedPengajuanPembaharuan.namaPimpinan}</p>
                <p><strong>No. HP Pimpinan:</strong> {selectedPengajuanPembaharuan.noHpPimpinan}</p>
                <p><strong>Tahun Berdiri:</strong> {selectedPengajuanPembaharuan.tahunBerdiri}</p>
                <p><strong>Jumlah Jamaah:</strong> {selectedPengajuanPembaharuan.jumlahJamaah}</p>
                <p><strong>Penyelenggara:</strong> {selectedPengajuanPembaharuan.penyelenggara}</p>
              </div>
              <div className="file-links">
                {[
                  { label: 'Surat Permohonan', key: 'suratPermohonan' },
                  { label: 'Rekomendasi KUA', key: 'rekomendasiKUA' },
                  { label: 'Susunan Kepengurusan', key: 'susunanKepengurusan' },
                  { label: 'Surat Domisili', key: 'suratDomisili' },
                  { label: 'Daftar Jamaah', key: 'daftarJamaah' },
                  { label: 'KTP Pengurus', key: 'ktpPengurus' },
                  { label: 'KTP Jamaah', key: 'ktpJamaah' },
                  { label: 'Akta Yayasan', key: 'aktaYayasan' },
                  { label: 'Proposal Pengajuan', key: 'proposalPengajuan' },
                ].map((file) => (
                  selectedPengajuanPembaharuan[file.key] && (
                    <p key={file.key}>
                      <strong>{file.label}:</strong>{' '}
                      <a href={selectedPengajuanPembaharuan[file.key]} target="_blank" rel="noopener noreferrer">
                        Lihat File
                      </a>
                    </p>
                  )
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Tutup</Button>
          <Button variant="success" onClick={handleApprove}>Terima</Button>
          <Button variant="danger" onClick={() => setShowRejectionModal(true)}>Tolak</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Rejection */}
      <Modal show={showRejectionModal} onHide={() => setShowRejectionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Alasan Penolakan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Masukkan alasan penolakan"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)}>Batal</Button>
          <Button variant="danger" onClick={handleReject}>Tolak</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Notification */}
      <Modal
        show={showNotification}
        onHide={() => setShowNotification(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className={`bg-${notificationVariant}`} closeButton>
          <Modal.Title>{notificationVariant === 'success' ? 'Sukses' : 'Gagal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notificationMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant={notificationVariant} onClick={() => setShowNotification(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PengajuanPembaharuanCard;
