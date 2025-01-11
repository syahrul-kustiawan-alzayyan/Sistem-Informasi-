import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/KANTOR-removebg-preview.png';
import './navbardaftar.css'

function NavbarDaftar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleStatusClick = () => {
    navigate('/status-pengajuan'); // Ganti dengan rute yang sesuai
  };

  return (
    <Navbar bg="light" expand="lg" className="navbar-custom">
      <Navbar.Brand onClick={handleLogoClick} className="navbar-logo" style={{ cursor: 'pointer' }}>
        <img
          src={logo}
          width="100%"
          height="100%"
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Button variant="success" className="status-button" onClick={handleStatusClick}>
          Status Pengajuan
        </Button>
      </Nav>
    </Navbar>
  );
}

export default NavbarDaftar;
