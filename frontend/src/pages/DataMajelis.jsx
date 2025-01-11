import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getMajelisTaklim } from '../redux/MajelisTaklimSlicer';
import MajelisCard from "../componentsadmin/Majeliscard";
import Sidebar from '../componentsadmin/sidebar';
import './datamajelis.css'

const DataMajelis = () => {
  const dispatch = useDispatch();
  const MajelisTaklim = useSelector(state => state.MajelisTaklim.MajelisTaklim);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/majelistaklim');
        dispatch(getMajelisTaklim(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
        <Sidebar />
        <div className="container">
        <h3 className="centered-title">Data Majelis Taklim Kabupaten Garut</h3>
          {/* Majelis Cards */}
          <div>
            {MajelisTaklim.length === 0 ? (
              <p>No Majelis Taklim data available</p>
            ) : (
              <MajelisCard
              />
            )}
          </div>
        </div>
    </div>
  );
};

export default DataMajelis;
