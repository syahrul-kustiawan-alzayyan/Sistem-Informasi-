import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../assets/KANTOR-removebg-preview.png';
import './navbar.css';

function NavbarCom() {
  const [changecolor, setchangecolor] = useState(false);
  const navigate = useNavigate(); // Define useNavigate

  const changeBackgroundColor = () => {
    if (window.scrollY > 250) {
      setchangecolor(true);
    } else {
      setchangecolor(false);
    }
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener('scroll', changeBackgroundColor);
    return () => window.removeEventListener('scroll', changeBackgroundColor);
  }, []);

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the login page when the button is clicked
  };

  return (
    <div className="sticky-top">
      <Navbar
        variant="light"
        expand="lg"
        className={`py-3 ${changecolor ? 'color-active' : ''} navbar-custom`}
      >
        <Container>
          {/* Navbar Brand - Logo */}
          <Navbar.Brand href="/" className="navbar-brand-custom">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          
          {/* Navbar Toggler */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navbar Navigation */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Link
                activeClass="active-link"
                to="home"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="nav-link-custom"
              >
                Beranda
              </Link>
              <Link
                activeClass="active-link"
                to="alur"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="nav-link-custom"
              >
                Alur Pendaftaran
              </Link>
              <Link
                activeClass="active-link"
                to="persyaratan"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="nav-link-custom"
              >
                Persyaratan
              </Link>
              <Link
                activeClass="active-link"
                to="faq"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="nav-link-custom"
              >
                FAQ
              </Link>
              <Button className="button" variant="success" onClick={handleLoginClick}>
                Masuk/Daftar
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarCom;
