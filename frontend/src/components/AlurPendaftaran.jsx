import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import step1Image from '../assets/alurpendaftran/Desain_tanpa_judul__2_-removebg-preview.png';
import step2Image from '../assets/alurpendaftran/Desain_tanpa_judul__3_-removebg-preview.png';
import step3Image from '../assets/alurpendaftran/Desain_tanpa_judul__4_-removebg-preview.png';
import './alurpendaftaran.css'; // Import the CSS file

function Alurpendaftaran() {
    const steps = [
      {
        id: 1,
        title: "Langkah Pertama",
        description: [
          "Kunjungi situs Majelis Taklim Kabupaten Garut",
          "Pilih menu Masuk/Daftar",
          "Jika belum memiliki akun, daftar terlebih dahulu",
          "Jika sudah memiliki akun, bisa langsung daftar"
        ],
        image: step1Image,
      },
      {
        id: 2,
        title: "Langkah Kedua",
        description: [
          "Pilih menu daftar Majelis Taklim pada halaman awal",
          "Siapkan dokumen-dokumen yang diperlukan",
          "Isi dan lengkapi form data pengajuan yang telah disediakan",
          "Submit data pengajuan yang telah diisi"
        ],
        image: step2Image,
      },
      {
        id: 3,
        title: "Langkah Ketiga",
        description: [
          "Data yang dikirimkan akan diproses oleh petugas Kemenag",
          "Jika pengajuan disetujui, ybs mendatangi kantor Kemenag Garut untuk mengambil surat keterangan terdaftar",
          "Jika pengajuan ditolak, perbaiki data pengajuan sesuai dengan syarat dan ketentuan"
        ],
        image: step3Image,
      }
    ];
  
    return (
      <Container id='alur' className="my-5">
        <h2 className="text-center mb-5">ALUR PENDAFTARAN</h2>
        <Row>
          {steps.map(step => (
            <Col key={step.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 text-center step-card shadow-lg">
                <Card.Body>
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="step-number me-2">{step.id}</div>
                    <h5 className="card-title">{step.title}</h5>
                  </div>
                  <img src={step.image} alt={`Langkah ${step.id}`} className="mb-3 step-image"/>
                  <ul className="list-unstyled text-start step-description">
                    {step.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
}

export default Alurpendaftaran;
