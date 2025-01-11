import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../assets/KANTOR-removebg-preview.png';
import './navbarlogin.css';

const Navbarlogin = () => {
    return (
        <Navbar expand="lg" className="custom-navbar" sticky="top">
            <Navbar.Brand href="/">
                <img
                    src={logo}
                    alt="Logo"
                    className="d-inline-block align-top navbar-logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <span className="navbar-text">
                        Sistem Informasi Majelis Taklim Kab. Garut
                    </span>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navbarlogin;
