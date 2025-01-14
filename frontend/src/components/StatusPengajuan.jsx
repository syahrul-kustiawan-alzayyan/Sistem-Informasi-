import axios from "axios";
import React, { useEffect, useState } from "react";
import './statuspengajuan.css'
import NavbarStatus from "./navbarstatus";

const StatusPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [dataPengajuanPembaharuan, setDataPengajuanPembaharuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("User ID tidak ditemukan. Harap login ulang.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3002/status-pengajuan/${userId}`
        );
        setDataPengajuan(response.data.dataPengajuan || []);
        setDataPengajuanPembaharuan(response.data.dataPengajuanPembaharuan || []);
      } catch (err) {
        setError("Gagal memuat data pengajuan");
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
                <td>{pengajuan.pesanPenolakan || "Tidak ada"}</td>
                <td>{new Date(pengajuan.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {dataPengajuanPembaharuan.length === 0 ? (
        <div>Tidak ada data pengajuan pembaharuan</div>
      ) : (
        <table className="tabel-status" border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Nama Pemohon</th>
              <th>Nama Majelis</th>
              <th>Status</th>
              <th>Catatan</th>
              <th>Tanggal Pembaharuan</th>
            </tr>
          </thead>
          <tbody>
            {dataPengajuanPembaharuan.map((pembaharuan) => (
              <tr key={pembaharuan._id}>
                <td>{pembaharuan.namaPemohon}</td>
                <td>{pembaharuan.namaMajelis}</td>
                <td>{pembaharuan.status}</td>
                <td>{pembaharuan.pesanPenolakan || "Tidak ada"}</td>
                <td>{new Date(pembaharuan.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div></>
  );
};

export default StatusPengajuan;
