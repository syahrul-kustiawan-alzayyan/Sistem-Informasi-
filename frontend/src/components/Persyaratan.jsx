import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './persyaratan.css';

const pdfFile = '/pdf/PMANO29.pdf';  // Ganti dengan path ke file PDF yang sesuai
const Docx1 = '/doc/Proposal Pengajuan Suket Terdaftar Majelis Taklim (1).docx';  // Ganti dengan path ke file DOCX

function Persyaratan() {
    return (
        <Container id='persyaratan' className="my-5">
            <h2 className="text-center mb-5">Persyaratan Pendaftaran</h2>
            <Row>
                <Col lg={6} md={12} className="mb-4">
                    <Card className="h-100 text-center shadow-sm p-3 persyaratan-card">
                        <h1>PMA No. 29 Tahun 2019</h1>
                        <Card.Body>
                            {/* Menampilkan PDF */}
                            <div style={{ height: '100vh', overflowY: 'auto' }}>
                                <Worker workerUrl="/pdf-worker/pdf.worker.min.js">
                                    <Viewer fileUrl={pdfFile} />
                                </Worker>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6} md={12} className="mb-4">
                    <Card className="h-100 text-start shadow-sm p-3 persyaratan-card">
                        <Card.Body>
                            <h5 className="font-weight-bold">Sesuai dengan <strong>Peraturan Menteri Agama No.29 tahun 2019</strong> menyatakan pendaftaran majelis taklim harus memenuhi persyaratan sebagai berikut:</h5>
                            <ul className="persyaratan-list">
                                <li>Surat Permohonan</li>
                                <li>Rekomendasi KUA Kecamatan</li>
                                <li>Susunan Kepengurusan</li>
                                <li>Surat Keterangan Domisili dari kepala desa</li>
                                <li>Daftar Jamaah</li>
                                <li>Fotocopy KTP pengurus</li>
                                <li>Fotocopy KTP jemaah minimal 15 orang</li>
                                <li>Fotocopy Akta Yayasan dan SK. MENKUMHAM Jika Penyelenggara Yayasan</li>
                            </ul>
                            <hr />
                            <h5 className="font-weight-bold">Download Proposal Pengajuan:</h5>
                            <ul className="download-list">
                                <li><a href={Docx1} download="TemplateProposal.docx">Download Proposal</a></li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Persyaratan;
