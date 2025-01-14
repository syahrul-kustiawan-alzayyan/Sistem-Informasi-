import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './navigasiutama.css';
import logo from '../assets/KANTOR-removebg-preview.png';

// Import tujuan link
import Beranda from './Beranda';
import AlurPendaftaran from './AlurPendaftaran';
import Persyaratan from './Persyaratan';
import FAQ from './FAQ';

function Navigasiutama() {
  const [activeSection, setActiveSection] = useState('beranda');

  const handleScroll = () => {
    const sections = [
      { id: 'home', component: Beranda },
      { id: 'alur', component: AlurPendaftaran },
      { id: 'persyaratan', component: Persyaratan },
      { id: 'faq', component: FAQ },
    ];

    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(id);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    window.location.reload(); // Refresh the page
  };

  const handleLoginClick = () => {
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Navbar.Brand onClick={handleLogoClick} className="custom-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto custom-nav-links">
          <Nav.Link
            className={activeSection === 'home' ? 'active' : ''}
            onClick={() => scrollToSection('home')}
          >
            Beranda
          </Nav.Link>
          <Nav.Link
            className={activeSection === 'alur' ? 'active' : ''}
            onClick={() => scrollToSection('alur')}
          >
            Alur Pendaftaran
          </Nav.Link>
          <Nav.Link
            className={activeSection === 'persyaratan' ? 'active' : ''}
            onClick={() => scrollToSection('persyaratan')}
          >
            Persyaratan
          </Nav.Link>
          <Nav.Link
            className={activeSection === 'faq' ? 'active' : ''}
            onClick={() => scrollToSection('faq')}
          >
            FAQ
          </Nav.Link>
        </Nav>
        <Button className="utama-custom-login-button" onClick={handleLoginClick}>
          Masuk / Daftar
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigasiutama;
