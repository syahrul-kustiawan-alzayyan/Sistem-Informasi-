import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Modal, Toast } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMajelisTaklim,
  getMajelisTaklim,
} from "../redux/MajelisTaklimSlicer";
import certificateImage from "../assets/Sertifikat/sertifikat.png";
import "./majeliscard.css";

const MajelisCard = () => {
  const dispatch = useDispatch();
  const MajelisTaklim = useSelector(
    (state) => state.MajelisTaklim.MajelisTaklim
  );

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [selectedMajelis, setSelectedMajelis] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterKelurahan, setFilterKelurahan] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/majelistaklim");
        dispatch(getMajelisTaklim(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleShowModal = (majelis) => {
    setSelectedMajelis(majelis);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMajelis(null);
  };

  const handleShowDeleteModal = (majelis) => {
    setSelectedMajelis(majelis);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMajelis(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3002/majelistaklim/${selectedMajelis._id}`);
      setShowToast(true);
      dispatch(deleteMajelisTaklim(selectedMajelis._id));
      setShowDeleteModal(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting Majelis Taklim:", error);
    }
  };

  const filteredMajelis = MajelisTaklim.filter((item) => {
    return (
      item.namaMajelis.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterKecamatan || item.kecamatan === filterKecamatan) &&
      (!filterKelurahan || item.kelurahan === filterKelurahan)
    );
  });

  const uniqueKecamatan = [
    ...new Set(MajelisTaklim.map((item) => item.kecamatan)),
  ];
  const uniqueKelurahan = [
    ...new Set(MajelisTaklim.map((item) => item.kelurahan)),
  ];

  const generateCertificate = (namaMajelis) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = certificateImage;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(namaMajelis, canvas.width / 2, canvas.height / 2);
    };

    img.onerror = () => {
      console.error("Gagal memuat gambar sertifikat");
    };
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${selectedMajelis.namaMajelis}-sertifikat.png`;
    link.click();
  };

  return (
    <div>
      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
      >
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
            <div className="card-header" style={{ backgroundColor: "#033c1a" }}>
              <h5>{item.namaMajelis}</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Kecamatan:</strong> {item.kecamatan}
              </p>
              <p>
                <strong>Kelurahan:</strong> {item.kelurahan}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Penghapusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah Anda yakin ingin menghapus Majelis Taklim ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Majelis Taklim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMajelis && (
            <>
              <div className="detail-container">
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(selectedMajelis.tanggal).toLocaleDateString()}
                </p>
                <p>
                  <strong>Nama Pemohon:</strong> {selectedMajelis.namaPemohon}
                </p>
                <p>
                  <strong>Alamat Pemohon:</strong>{" "}
                  {selectedMajelis.alamatPemohon}
                </p>
                <p>
                  <strong>No. HP Pemohon:</strong> {selectedMajelis.noHpPemohon}
                </p>
                <p>
                  <strong>Nama Majelis:</strong> {selectedMajelis.namaMajelis}
                </p>
                <p>
                  <strong>Alamat Majelis:</strong>{" "}
                  {selectedMajelis.alamatMajelis}
                </p>
                <p>
                  <strong>Kecamatan:</strong> {selectedMajelis.kecamatan}
                </p>
                <p>
                  <strong>Kelurahan:</strong> {selectedMajelis.kelurahan}
                </p>
                <p>
                  <strong>Nama Pimpinan:</strong> {selectedMajelis.namaPimpinan}
                </p>
                <p>
                  <strong>No. HP Pimpinan:</strong>{" "}
                  {selectedMajelis.noHpPimpinan}
                </p>
                <p>
                  <strong>Tahun Berdiri:</strong> {selectedMajelis.tahunBerdiri}
                </p>
                <p>
                  <strong>Jumlah Jamaah:</strong> {selectedMajelis.jumlahJamaah}
                </p>
                <p>
                  <strong>Penyelenggara:</strong>{" "}
                  {selectedMajelis.penyelenggara}
                </p>
              </div>
              <div className="file-links">
                {[
                  { label: "Surat Permohonan", key: "suratPermohonan" },
                  { label: "Rekomendasi KUA", key: "rekomendasiKUA" },
                  { label: "Susunan Kepengurusan", key: "susunanKepengurusan" },
                  { label: "Surat Domisili", key: "suratDomisili" },
                  { label: "Daftar Jamaah", key: "daftarJamaah" },
                  { label: "KTP Pengurus", key: "ktpPengurus" },
                  { label: "KTP Jamaah", key: "ktpJamaah" },
                  { label: "Akta Yayasan", key: "aktaYayasan" },
                  { label: "Proposal Pengajuan", key: "proposalPengajuan" },
                ].map(
                  (file) =>
                    selectedMajelis[file.key] && (
                      <p key={file.key}>
                        <strong>{file.label}:</strong>{" "}
                        <a
                          href={selectedMajelis[file.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Lihat File
                        </a>
                      </p>
                    )
                )}
              </div>
              {/* Canvas for certificate */}
              <canvas ref={canvasRef} width={1414} height={2000} style={{ display: "none" }}></canvas>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => generateCertificate(selectedMajelis.namaMajelis)}>
            Generate Sertifikat
          </Button>
          <Button variant="success" onClick={downloadCertificate}>
            Unduh Sertifikat
          </Button>
          <Button
            variant="danger"
            onClick={() => handleShowDeleteModal(selectedMajelis)}
          >
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
