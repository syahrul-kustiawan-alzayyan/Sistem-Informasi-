import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const StatusPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;};

  // Ganti dengan ID user yang diambil dari konteks atau cookie
  const userId = getCookie("token"); // Simpan userId di localStorage saat login

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/status-pengajuan/${userId}`);
        setDataPengajuan(response.data);
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
    <div>
      <h1>Status Pengajuan Majelis Taklim</h1>
      {dataPengajuan.length === 0 ? (
        <div>Tidak ada data pengajuan</div>
      ) : (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Nama Pemohon</th>
              <th>Nama Majelis</th>
              <th>Status</th>
              <th>Tanggal Pengajuan</th>
            </tr>
          </thead>
          <tbody>
            {dataPengajuan.map((pengajuan) => (
              <tr key={pengajuan._id}>
                <td>{pengajuan.namaPemohon}</td>
                <td>{pengajuan.namaMajelis}</td>
                <td>{pengajuan.status}</td>
                <td>{new Date(pengajuan.tanggal).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StatusPengajuan;
