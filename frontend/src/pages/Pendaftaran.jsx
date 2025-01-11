import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavbarDaftar from '../components/NavbarDaftar'; // Impor NavbarCom
import './pendaftaran.css';
import newRegistrationImage from '../assets/pendaftaran/Screenshot_2024-08-15_084837-removebg-preview.png';  
import renewalImage from '../assets/pendaftaran/53537-removebg-preview.png'; 

function Pendaftaran() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/formpendaftaranbaru');
  };
  const handleClick1 = () => {
    navigate('/formpembaharuan')
  };
  return (
    <>
      <NavbarDaftar /> {/* Tambahkan komponen NavbarCom */}
      <Container className="pendaftaran-container">
        <Row className="align-items-center">
          <Col md="auto">
            <h2 className="pendaftaran-title align-items-center">DAFTAR MAJELIS TAKLIM</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="text-center pendaftaran-card">
              <Card.Img variant="top" src={newRegistrationImage} className="pendaftaran-image1" />
              <Card.Body>
                <Button variant="success" className="pendaftaran-button" onClick={handleClick}>
                  Daftar Baru
                </Button>
                <Card.Text className="mt-3">
                  Halaman Pendaftaran bagi majelis taklim yang belum pernah terdaftarkan sebelumnya.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="text-center pendaftaran-card">
              <Card.Img variant="top" src={renewalImage} className="pendaftaran-image2" />
              <Card.Body>
                <Button variant="success" className="pendaftaran-button" onClick={handleClick1}>
                  Daftar Pembaharuan
                </Button>
                <Card.Text className="mt-3">
                  Halaman Pendaftaran bagi majelis taklim yang telah terdaftar sebelumnya namun masa berlaku surat keterangannya telah habis.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Pendaftaran;
