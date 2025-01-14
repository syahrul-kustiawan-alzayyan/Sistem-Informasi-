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
import "./sisteminformasi.css";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const SistemInformasi = () => {
  const [totalStatsMajelisTaklim, setTotalStatsMajelisTaklim] = useState(null);
  const [kecamatanStats, setKecamatanStats] = useState([]);
  const [majelisData, setMajelisData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterKelurahan, setFilterKelurahan] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchTotalStatsMajelisTaklim = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/stats/totalmajelistaklim`
        );
        setTotalStatsMajelisTaklim(response.data);
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

    const fetchMajelisData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/majelistaklim");
        setMajelisData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error("Error fetching majelis data:", err);
      }
    };

    fetchTotalStatsMajelisTaklim();
    fetchKecamatanStats();
    fetchMajelisData();
  }, []);

  useEffect(() => {
    let data = majelisData;

    if (searchTerm) {
      data = data.filter((item) =>
        item.namaMajelis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterKecamatan) {
      data = data.filter((item) => item.kecamatan === filterKecamatan);
    }

    if (filterKelurahan) {
      data = data.filter((item) => item.kelurahan === filterKelurahan);
    }

    setFilteredData(data);
  }, [searchTerm, filterKecamatan, filterKelurahan, majelisData]);

  const kecamatanLabels = [
    ...new Set(filteredData.map((item) => item.kecamatan)),
  ];
  const kecamatanCounts = kecamatanLabels.map(
    (kec) => filteredData.filter((item) => item.kecamatan === kec).length
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Data Majelis Taklim Kabupaten Garut</h1>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Cari Nama Majelis Taklim"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterKecamatan}
          onChange={(e) => setFilterKecamatan(e.target.value)}
        >
          <option value="">Kecamatan</option>
          {kecamatanStats.map((kecamatan) => (
            <option key={kecamatan._id} value={kecamatan._id}>
              {kecamatan._id}
            </option>
          ))}
        </select>
        <select
          value={filterKelurahan}
          onChange={(e) => setFilterKelurahan(e.target.value)}
        >
          <option value="">Kelurahan</option>
          {Array.from(new Set(majelisData.map((item) => item.kelurahan))).map(
            (kelurahan) => (
              <option key={kelurahan} value={kelurahan}>
                {kelurahan}
              </option>
            )
          )}
        </select>
      </div>

      <div className="content-container">
        <div className="data-container">
          <div className="chart-container">
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
                      ticks: { font: { size: 14 } },
                    },
                    y: {
                      ticks: { font: { size: 14 } },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama Majelis Taklim</th>
                  <th>Jumlah Jemaah</th>
                  <th>Kecamatan</th>
                  <th>Kelurahan</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.namaMajelis}</td>
                    <td>{item.jumlahJamaah}</td>
                    <td>{item.kecamatan}</td>
                    <td>{item.kelurahan}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-container">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= filteredData.length}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SistemInformasi;
