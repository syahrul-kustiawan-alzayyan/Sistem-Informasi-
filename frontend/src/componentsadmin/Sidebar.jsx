import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaListAlt, FaPlus, FaSyncAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import logo from "../assets/KANTOR__2_-removebg-preview.png";
import "./sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Hapus token pengguna (misalnya, dari cookie)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Arahkan pengguna ke halaman login
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="logo-container">
        {isOpen && (
          <img src={logo} alt="Logo Kementerian Agama" className="logo" />
        )}
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>
      <Nav className="nav-links">
        <Link to="/admin-dashboard" className="nav-link">
          <FaTachometerAlt /> {isOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/data-majelis" className="nav-link">
          <FaListAlt /> {isOpen && <span>Data Majelis Taklim</span>}
        </Link>
        <Link to="/pengajuan-baru" className="nav-link">
          <FaPlus /> {isOpen && <span>Pengajuan Baru</span>}
        </Link>
        <Link to="/pengajuan-pembaharuan" className="nav-link">
          <FaSyncAlt /> {isOpen && <span>Pengajuan Pembaharuan</span>}
        </Link>
      </Nav>
      <button
        className="logout-btn"
        onClick={() => setShowLogoutPopup(true)}
      >
        <FaSignOutAlt /> {isOpen && <span>Logout</span>}
      </button>

      {/* Popup untuk konfirmasi logout */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Apakah Anda yakin ingin logout?</p>
            <div className="popup-actions">
              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Ya, Logout
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutPopup(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
