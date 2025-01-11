import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchPengajuanBaru } from '../redux/PengajuanBaruSlicer';
import Sidebar from './sidebar';
import PengajuanBaruCard from "./PengajuanBarucard";

const DataPengajuanBaru = () => {
  const dispatch = useDispatch();
  const Pengajuanbaru = useSelector(state => state.PengajuanBaru.PengajuanBaru);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/PengajuanBaru');
        dispatch(fetchPengajuanBaru(response.data));
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
        <h3 className="text-center mb-4">Data Pengajuan Majelis Taklim Baru</h3>
            <div className="scrollable-container">
            {Pengajuanbaru.length === 0 ? (
                <p>No Majelis Taklim data available</p>
            ) : (
                <PengajuanBaruCard /> // Displaying cards of Majelis Taklim
            )}
            </div>
        </div>
    </div>
  );
}

export default DataPengajuanBaru;