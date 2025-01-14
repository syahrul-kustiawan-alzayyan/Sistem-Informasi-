import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Pendaftaran from './pages/Pendaftaran';
import HalamanUtama from './pages/HalamanUtama';
import FormPendaftaranBaru from './pages/FormPendaftaranbaru';
import FormPembaharuan from './pages/FormPembaharuan';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'; // Pastikan Anda membuat file CSS untuk transisi
import AdminDashboard from './pages/adminDashboard';
import DataMajelis from "./pages/DataMajelis";
import DataPengajuanPembaharuan from "./componentsadmin/DataPengajuanpembaharuan";
import DataPengajuanBaru from './componentsadmin/DataPengajuanbaru';
import StatusPengajuan from './components/StatusPengajuan';



function App() {
  return (
    <Router>
      <TransitionWrapper>
        <Routes>
          <Route path="/" element={<HalamanUtama />} />
          <Route path="/pendaftaran" element={<Pendaftaran />} />
          <Route path="/formpendaftaranbaru" element={<FormPendaftaranBaru />} />
          <Route path="/formpembaharuan" element={<FormPembaharuan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/data-majelis" element={<DataMajelis />} />
          <Route path="/pengajuan-baru" element={<DataPengajuanBaru />} />
          <Route path="/pengajuan-pembaharuan" element={<DataPengajuanPembaharuan />} />
          <Route path="/status-pengajuan" element={<StatusPengajuan/>}/>
        </Routes>
      </TransitionWrapper>
    </Router>
  );
}

function TransitionWrapper({ children }) {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        nodeRef={nodeRef}
        classNames="fade"
        timeout={500}
      >
        <div ref={nodeRef} className="page">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
