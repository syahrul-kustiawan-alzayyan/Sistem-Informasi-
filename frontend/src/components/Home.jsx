import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Cookies from 'js-cookie';

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Example authentication check (this should be replaced with your actual auth check)
  const isAuthenticated = !!Cookies.get('token'); // Check if token exists in cookies

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/pendaftaran'); // Proceed to the registration page
    } else {
      setShowModal(true); // Show the modal
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="home-background">
      <Container className="home-container">
        <Row className="home-row">
          <Col className="text-center">
            <Button className="daftar-button" onClick={handleClick}>
              DAFTAR MAJELIS TAKLIM
            </Button>
          </Col>
        </Row>

        {/* Modal for login notification */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Login Diperlukan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Anda harus login terlebih dahulu untuk mendaftar Majelis Taklim.
          </Modal.Body> 
          <Modal.Footer>
            <Button className= "button-batal" variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button className= "button-login" variant="primary" onClick={handleCloseModal}>
              Login Sekarang
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Home;
