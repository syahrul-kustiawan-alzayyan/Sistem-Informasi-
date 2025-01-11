import React from 'react';
import logo from '../assets/KANTOR__2_-removebg-preview.png';
import './footer.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Import icons from react-icons

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo-section">
        <img src={logo} alt="Logo" className="footer-logo" />
      </div>
      <div className="footer-info">
        <div className="footer-text">
          <FaMapMarkerAlt className="footer-icon" />
          <div className="footer-address">
            <span>Alamat</span>
            <p>Jalan Pahlawan Nomor 65 Garut, Garut, Indonesia, West Java</p>
          </div>
        </div>
        <div className="footer-contact">
          <div className="footer-text">
            <FaPhoneAlt className="footer-icon" />
            <div className="footer-contact-item">
              <span>Telepon</span>
              <p>+82 2-1409-9369</p>
            </div>
          </div>
          <div className="footer-text">
            <FaEnvelope className="footer-icon" />
            <div className="footer-contact-item">
              <span>Email</span>
              <p>garuthumaskemenag@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
