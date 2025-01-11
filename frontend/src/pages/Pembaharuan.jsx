import React from 'react'
import TabelPengajuanBaru from '../components/tabelPengajuanBaru'
import logo from '../assets/KANTOR-removebg-preview.png';

function Pembaharuan() {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>SISTEM INFORMASI MAJELIS TAKLIM KABUPATEN GARUT</h1>
        <button className="logout-button">LOG OUT</button>
      </header>

      <div className="dashboard-content">
        <div className="main-panel">
          <h2>DATA MAJELIS TAKLIM</h2>
          <div className="data-panel">
            <TabelPengajuanBaru/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pembaharuan