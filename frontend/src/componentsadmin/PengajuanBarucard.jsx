import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchPengajuanBaru } from "../redux/PengajuanBaruSlicer";

const PengajuanBaruCard = () => {
  const dispatch = useDispatch();
  const PengajuanBaru = useSelector(
    (state) => state.PengajuanBaru.PengajuanBaru
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedPengajuanBaru, setSelectedPengajuanBaru] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // State for notification modal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationVariant, setNotificationVariant] = useState(""); // 'success' or 'danger'

  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterKelurahan, setFilterKelurahan] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/pengajuanbaru");
        dispatch(fetchPengajuanBaru(response.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleShowModal = (PengajuanBaru) => {
    setSelectedPengajuanBaru(PengajuanBaru);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPengajuanBaru(null);
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:3002/pengajuanbaru/${selectedPengajuanBaru._id}`,
        {
          data: { status: "ditolak", pesanPenolakan: rejectionReason },
        }
      );
      setNotificationMessage("Data berhasil ditolak!");
      setNotificationVariant("success");
      setShowNotification(true);

      setTimeout(() => {
        setShowModal(false);
        setShowRejectionModal(false);
        setShowNotification(false);
        dispatch(removePengajuanBaru(selectedPengajuanBaru._id));
        setRejectionReason("");
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Error rejecting data:", err);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/majelistaklim",
        selectedPengajuanBaru
      );
      if (response.status === 200) {
        setNotificationMessage("Data berhasil dipindahkan ke Majelis Taklim!");
        setNotificationVariant("success");
        setShowNotification(true);

        setTimeout(() => {
          setShowModal(false);
          setShowNotification(false);
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.error("Error approving data:", err);
      setNotificationMessage("Gagal memindahkan data ke Majelis Taklim!");
      setNotificationVariant("danger");
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  // Filter and Search Logic
  const filteredPengajuanBaru = PengajuanBaru.filter((item) => {
    return (
      item.namaMajelis.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterKecamatan || item.kecamatan === filterKecamatan) &&
      (!filterKelurahan || item.kelurahan === filterKelurahan)
    );
  });

  // Extract unique kecamatan and kelurahan for filters
  const uniqueKecamatan = [
    ...new Set(PengajuanBaru.map((item) => item.kecamatan)),
  ];
  const uniqueKelurahan = [
    ...new Set(PengajuanBaru.map((item) => item.kelurahan)),
  ];

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
        {filteredPengajuanBaru.map((item, index) => (
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

      {/* Modal Detail */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Majelis Taklim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPengajuanBaru && (
            <>
              <div className="detail-container">
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(selectedPengajuanBaru.tanggal).toLocaleDateString()}
                </p>
                <p>
                  <strong>Nama Pemohon:</strong>{" "}
                  {selectedPengajuanBaru.namaPemohon}
                </p>
                <p>
                  <strong>Alamat Pemohon:</strong>{" "}
                  {selectedPengajuanBaru.alamatPemohon}
                </p>
                <p>
                  <strong>No. HP Pemohon:</strong>{" "}
                  {selectedPengajuanBaru.noHpPemohon}
                </p>
                <p>
                  <strong>Nama Majelis:</strong>{" "}
                  {selectedPengajuanBaru.namaMajelis}
                </p>
                <p>
                  <strong>Alamat Majelis:</strong>{" "}
                  {selectedPengajuanBaru.alamatMajelis}
                </p>
                <p>
                  <strong>Kecamatan:</strong> {selectedPengajuanBaru.kecamatan}
                </p>
                <p>
                  <strong>Kelurahan:</strong> {selectedPengajuanBaru.kelurahan}
                </p>
                <p>
                  <strong>Nama Pimpinan:</strong>{" "}
                  {selectedPengajuanBaru.namaPimpinan}
                </p>
                <p>
                  <strong>No. HP Pimpinan:</strong>{" "}
                  {selectedPengajuanBaru.noHpPimpinan}
                </p>
                <p>
                  <strong>Tahun Berdiri:</strong>{" "}
                  {selectedPengajuanBaru.tahunBerdiri}
                </p>
                <p>
                  <strong>Jumlah Jamaah:</strong>{" "}
                  {selectedPengajuanBaru.jumlahJamaah}
                </p>
                <p>
                  <strong>Penyelenggara:</strong>{" "}
                  {selectedPengajuanBaru.penyelenggara}
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
                    selectedPengajuanBaru[file.key] && (
                      <p key={file.key}>
                        <strong>{file.label}:</strong>{" "}
                        <a
                          href={selectedPengajuanBaru[file.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Lihat File
                        </a>
                      </p>
                    )
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
          <Button variant="success" onClick={handleApprove}>
            Terima
          </Button>
          <Button variant="danger" onClick={() => setShowRejectionModal(true)}>
            Tolak
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Rejection */}
      <Modal
        show={showRejectionModal}
        onHide={() => setShowRejectionModal(false)}
        centered
      >
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
          <Button
            variant="secondary"
            onClick={() => setShowRejectionModal(false)}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Tolak
          </Button>
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
          <Modal.Title>
            {notificationVariant === "success" ? "Sukses" : "Gagal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{notificationMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={notificationVariant}
            onClick={() => setShowNotification(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PengajuanBaruCard;
