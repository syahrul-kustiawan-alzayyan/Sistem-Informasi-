import React from "react";
import AlurPendaftaran from "../components/AlurPendaftaran";
import Beranda from "../components/Beranda";
import Navigasiutama from "../components/Navigasiutama";
import Footer from "../components/Footer";
import Home from "../components/Home";
import Persyaratan from "../components/Persyaratan";
import SistemInformasi from "../components/SistemInformasi";
import FAQ from "../components/Faq"
import "./halamanutama.css";


function HalamanUtama() {
  return (
    <div className="utama">
      <Home />
      <Navigasiutama/>
      <Beranda />
      <SistemInformasi />
      <AlurPendaftaran />
      <Persyaratan />
      <FAQ />
      <Footer />
    </div>
  );
}

export default HalamanUtama;
