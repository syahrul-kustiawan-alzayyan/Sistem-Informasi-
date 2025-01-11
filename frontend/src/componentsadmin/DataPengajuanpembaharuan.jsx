import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchPengajuanPembaharuan } from '../redux/PengajuanPembaharuanSlicer';
import Sidebar from './sidebar';
import './pengajuanPembaharuancard.css'
import PengajuanPembaharuanCard from "./PengajuanPembaharuanCard";

const DataPengajuanPembaharuan = () => {
  const dispatch = useDispatch();
  const PengajuanPembaharuan = useSelector(state => state.PengajuanPembaharuan.PengajuanPembaharuan);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/PengajuanPembaharuan');
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
}

export default DataPengajuanPembaharuan;
