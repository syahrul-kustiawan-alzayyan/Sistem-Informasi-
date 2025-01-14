import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/KANTOR-removebg-preview.png';
import './navbardaftar.css'

function NavbarStatus() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
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
    </Navbar>
  );
}

export default NavbarStatus;
