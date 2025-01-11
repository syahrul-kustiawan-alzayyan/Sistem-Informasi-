import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Cookies from 'js-cookie';

function Home() {
  const navigate = useNavigate();

  // Example authentication check (this should be replaced with your actual auth check)
  const isAuthenticated = !!Cookies.get('token'); // Check if token exists in localStorage

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/pendaftaran'); // Proceed to the registration page
    } else {
      alert('Anda harus login terlebih dahulu untuk mendaftar Majelis Taklim'); // Display alert
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <div className="home-background">
      <Container className="home-container">
        <Row className="home-row">
          <Col className="text-center">
            <Button className="home-button" onClick={handleClick}>
              DAFTAR MAJELIS TAKLIM
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
