import axios from "axios";
import React, { useEffect, useState } from "react";
import './statuspengajuan.css'
import NavbarStatus from "./navbarstatus";



const StatusPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [dataPengajuanPembaharuan, setDataPengajuanPembaharuan] = useState([]);
  const [dataMajelis, setDataMajelis] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  const downloadSertifikat = (id) => {
    window.location.href = `http://localhost:3002/download-sertifikat/${id}`;
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("User ID tidak ditemukan. Harap login ulang.");
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.get(
          "http://localhost:3002/status-pengajuan",
          {
            headers: {
              Authorization: `Bearer ${userId}`,
            },
          }
        );
    
        setDataPengajuan(response.data.dataPengajuan || []);
        setDataPengajuanPembaharuan(response.data.dataPengajuanPembaharuan || []);
        setDataMajelis(response.data.dataMajelis || []);
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();  
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <><NavbarStatus /><div className="status-container">
      <h1>Status Pengajuan Majelis Taklim</h1>
      {dataPengajuan.length === 0 ? (
        <div>Tidak ada data pengajuan</div>
      ) : (
        <table className="tabel-status" border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Nama Pemohon</th>
              <th>Nama Majelis</th>
              <th>Status</th>
              <th>Catatan</th>
              <th>Tanggal Pengajuan</th>
            </tr>
          </thead>
          <tbody>
            {dataPengajuan.map((pengajuan) => (
              <tr key={pengajuan._id}>
                <td>{pengajuan.namaPemohon}</td>
                <td>{pengajuan.namaMajelis}</td>
                <td>{pengajuan.status}</td>
                <td>{pengajuan.pesanPenolakan }</td>
                <td>{new Date(pengajuan.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {dataPengajuanPembaharuan.length === 0 ? (
        <div></div>
      ) : (
        <table className="tabel-status" border="1" style={{ width: "100%", textAlign: "left" }}>
          <tbody>
            {dataPengajuanPembaharuan.map((pembaharuan) => (
              <tr key={pembaharuan._id}>
                <td>{pembaharuan.namaPemohon}</td>
                <td>{pembaharuan.namaMajelis}</td>
                <td>{pembaharuan.status}</td>
                <td>{pembaharuan.pesanPenolakan}</td>
                <td>{new Date(pembaharuan.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h1>Data Majelis Taklim</h1>
      {dataMajelis.length === 0 ? (
        <div> tidak ada data </div>
      ) : (
        <table className="tabel-status" border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Nama Pemohon</th>
              <th>Nama Majelis</th>
              <th>Status</th>
              <th>Tanggal Pengajuan</th>
              <th>Sertifikat</th>
            </tr>
          </thead>
          <tbody>
            {dataMajelis.map((MajelisTaklim) => (
              <tr key={MajelisTaklim._id}>
                <td>{MajelisTaklim.namaPemohon}</td>
                <td>{MajelisTaklim.namaMajelis}</td>
                <td>{MajelisTaklim.status}</td>
                <td>{new Date(MajelisTaklim.tanggal).toLocaleDateString()}</td>
                <td>
                <button
                      style={{
                        backgroundColor: MajelisTaklim.sertifikat ? 'green' : 'red',
                        color: 'white',
                      }}
                      onClick={() => MajelisTaklim.sertifikat ? downloadSertifikat(MajelisTaklim._id) : null}
                    >
                      {MajelisTaklim.sertifikat ? 'Download Sertifikat' : 'Sertifikat belum ada'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div></>
  );
};

export default StatusPengajuan;
