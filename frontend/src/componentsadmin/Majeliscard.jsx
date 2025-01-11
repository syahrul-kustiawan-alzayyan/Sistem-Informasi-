import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getMajelisTaklim, deleteMajelisTaklim } from '../redux/MajelisTaklimSlicer';
import { Modal, Button, Form, Toast } from 'react-bootstrap';// Import useNavigate for redirection
import './majeliscard.css';

const MajelisCard = () => {
  const dispatch = useDispatch(); // Initialize navigate
  const MajelisTaklim = useSelector((state) => state.MajelisTaklim.MajelisTaklim);

  const [showModal, setShowModal] = useState(false);
  const [selectedMajelis, setSelectedMajelis] = useState(null);
  const [showToast, setShowToast] = useState(false); // State for showing toast message

  const [searchTerm, setSearchTerm] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterKelurahan, setFilterKelurahan] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/majelistaklim');
        dispatch(getMajelisTaklim(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleShowModal = (majelis) => {
    setSelectedMajelis(majelis);  // Make sure majelis has the `_id` field
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMajelis(null);
  };

  // Tambahkan fungsi untuk menghapus data
  const handleDelete = async (_id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus Majelis Taklim ini?')) {
      try {
        // Make sure the URL matches the backend route
        await axios.delete(`http://localhost:3002/majelistaklim/${_id}`);
  
        // If successful, dispatch action and close modal
        setShowToast(true);
        dispatch(deleteMajelisTaklim(_id));
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting Majelis Taklim:', error);
      }
    }
  };
  
  

  // Filter and Search Logic
  const filteredMajelis = MajelisTaklim.filter((item) => {
    return (
      item.namaMajelis.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterKecamatan || item.kecamatan === filterKecamatan) &&
      (!filterKelurahan || item.kelurahan === filterKelurahan)
    );
  });

  // Extract unique kecamatan and kelurahan for filters
  const uniqueKecamatan = [...new Set(MajelisTaklim.map((item) => item.kecamatan))];
  const uniqueKelurahan = [...new Set(MajelisTaklim.map((item) => item.kelurahan))];

  return (
    <div>
      {/* Toast Notification */}
      <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
        <Toast.Body>Majelis Taklim berhasil dihapus!</Toast.Body>
      </Toast>

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
        {filteredMajelis.map((item, index) => (
          <div
            className="majelis-card"
            key={index}
            onClick={() => handleShowModal(item)}
          >
            <div className="card-header" style={{ backgroundColor: '#033c1a' }}>
              <h5>{item.namaMajelis}</h5>
            </div>
            <div className="card-body">
              <p><strong>Kecamatan:</strong> {item.kecamatan}</p>
              <p><strong>Kelurahan:</strong> {item.kelurahan}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Detail Majelis Taklim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMajelis && (
            <>
              <div className="detail-container">
                <p><strong>Tanggal:</strong> {new Date(selectedMajelis.tanggal).toLocaleDateString()}</p>
                <p><strong>Nama Pemohon:</strong> {selectedMajelis.namaPemohon}</p>
                <p><strong>Alamat Pemohon:</strong> {selectedMajelis.alamatPemohon}</p>
                <p><strong>No. HP Pemohon:</strong> {selectedMajelis.noHpPemohon}</p>
                <p><strong>Nama Majelis:</strong> {selectedMajelis.namaMajelis}</p>
                <p><strong>Alamat Majelis:</strong> {selectedMajelis.alamatMajelis}</p>
                <p><strong>Kecamatan:</strong> {selectedMajelis.kecamatan}</p>
                <p><strong>Kelurahan:</strong> {selectedMajelis.kelurahan}</p>
                <p><strong>Nama Pimpinan:</strong> {selectedMajelis.namaPimpinan}</p>
                <p><strong>No. HP Pimpinan:</strong> {selectedMajelis.noHpPimpinan}</p>
                <p><strong>Tahun Berdiri:</strong> {selectedMajelis.tahunBerdiri}</p>
                <p><strong>Jumlah Jamaah:</strong> {selectedMajelis.jumlahJamaah}</p>
                <p><strong>Penyelenggara:</strong> {selectedMajelis.penyelenggara}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleDelete(selectedMajelis._id)}>
            Hapus
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MajelisCard;
