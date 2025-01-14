import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPengajuanPembaharuan } from "../redux/PengajuanPembaharuanSlicer";
import PengajuanPembaharuanCard from "./PengajuanPembaharuanCard";
import Sidebar from "./Sidebar";

const DataPengajuanPembaharuan = () => {
  const dispatch = useDispatch();
  const PengajuanPembaharuan = useSelector(
    (state) => state.PengajuanPembaharuan.PengajuanPembaharuan
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/PengajuanPembaharuan"
        );
        dispatch(fetchPengajuanPembaharuan(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar />,
      <div className="flex-grow-1 p-3">
        <h3 className="text-center mb-4">Data Pengajuan Pembaharuan</h3>
        <div className="scrollable-container">
          {PengajuanPembaharuan.length === 0 ? (
            <p>No Majelis Taklim data available</p>
          ) : (
            <PengajuanPembaharuanCard /> // Displaying cards of Majelis Taklim
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPengajuanPembaharuan;
