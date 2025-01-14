import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DashboardAdmin = () => {
  const [totalStatsMajelisTaklim, setTotalStatsMajelisTaklim] = useState(null);
  const [totalStatsPengajuanBaru, setTotalStatsPengajuanBaru] = useState(null);
  const [totalStatsPengajuanPembaharuan, setTotalStatsPengajuanPembaharuan] =
    useState(null);
  const [kecamatanStats, setKecamatanStats] = useState([]);

  useEffect(() => {
    const fetchTotalStatsMajelisTaklim = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/stats/totalmajelistaklim"
        );
        setTotalStatsMajelisTaklim(response.data);
      } catch (err) {
        console.error("Error fetching total stats:", err);
      }
    };
    const fetchTotalStatsPengajuanBaru = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/stats/totalpengajuanbaru"
        );
        setTotalStatsPengajuanBaru(response.data);
      } catch (err) {
        console.error("Error fetching total stats:", err);
      }
    };
    const fetchTotalStatsPengajuanPembaharuan = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/stats/totalpengajuanpembaharuan"
        );
        setTotalStatsPengajuanPembaharuan(response.data);
      } catch (err) {
        console.error("Error fetching total stats:", err);
      }
    };

    const fetchKecamatanStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/stats/kecamatan"
        );
        setKecamatanStats(response.data);
      } catch (err) {
        console.error("Error fetching kecamatan stats:", err);
      }
    };

    fetchTotalStatsPengajuanPembaharuan();
    fetchTotalStatsPengajuanBaru();
    fetchTotalStatsMajelisTaklim();
    fetchKecamatanStats();
  }, []);

  const kecamatanLabels = kecamatanStats.map((item) => item._id);
  const kecamatanCounts = kecamatanStats.map((item) => item.count);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Admin</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Pengajuan Baru</h3>
          <p>
            {totalStatsPengajuanBaru
              ? totalStatsPengajuanBaru.totalPengajuanBaru
              : "Loading..."}
          </p>
        </div>
        <div className="stat-card">
          <h3>Pengajuan Pembaharuan</h3>
          <p>
            {totalStatsPengajuanPembaharuan
              ? totalStatsPengajuanPembaharuan.totalPengajuanPembaharuan
              : "Loading..."}
          </p>
        </div>
        <div className="stat-card">
          <h3>Total Majelis Taklim</h3>
          <p>
            {totalStatsMajelisTaklim
              ? totalStatsMajelisTaklim.totalMajelis
              : "Loading..."}
          </p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Data Majelis Taklim</h3>
        <div className="chart">
          <Bar
            data={{
              labels: kecamatanLabels,
              datasets: [
                {
                  label: "Jumlah Majelis Taklim",
                  data: kecamatanCounts,
                  backgroundColor: "#032908",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  ticks: {
                    font: {
                      size: 14,
                    },
                  },
                },
                y: {
                  ticks: {
                    font: {
                      size: 14,
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
