import React from 'react'; 
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/KANTOR-removebg-preview.png';
import './navbar.css';

function NavbarCom() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the login page when the button is clicked
  };

  return (
    <div className="navbar-utama-sticky-top">
      <Navbar variant="light" expand="lg" className="py-3 navbar-utama-custom">
        <Container>
          <Navbar.Brand href="/" className="navbar-utama-brand-custom">
            <img
              src={logo}
              alt="Logo"
              className="navbar-utama-logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <Link
                activeClass="navbar-utama-active-link"
                to="home"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="navbar-utama-nav-link-custom mx-3"
              >
                Beranda
              </Link>
              <Link
                activeClass="navbar-utama-active-link"
                to="alur"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="navbar-utama-nav-link-custom mx-3"
              >
                Alur Pendaftaran
              </Link>
              <Link
                activeClass="navbar-utama-active-link"
                to="persyaratan"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="navbar-utama-nav-link-custom mx-3"
              >
                Persyaratan
              </Link>
              <Link
                activeClass="navbar-utama-active-link"
                to="faq"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="navbar-utama-nav-link-custom mx-3"
              >
                FAQ
              </Link>
              <Button className='navbar-utama-button' variant="success" onClick={handleLoginClick}>
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
