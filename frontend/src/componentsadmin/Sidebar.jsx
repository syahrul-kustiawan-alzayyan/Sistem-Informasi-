import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaListAlt, FaPlus, FaSyncAlt, FaSignOutAlt, FaBars } from "react-icons/fa";
import logo from "../assets/KANTOR__2_-removebg-preview.png";
import "./sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      <button className="logout-btn">
        <FaSignOutAlt /> {isOpen && <span>Logout</span>}
      </button>
    </div>
  );
}

export default Sidebar;
