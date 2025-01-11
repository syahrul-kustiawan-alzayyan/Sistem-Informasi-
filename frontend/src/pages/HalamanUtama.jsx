import React from 'react'
import Home from '../components/Home'
import NavbarCom from '../components/NavbarCom'
import Beranda from '../components/Beranda'
import AlurPendaftaran from '../components/AlurPendaftaran'
import Persyaratan from '../components/Persyaratan'
import FAQ from '../components/Faq'
import Footer from '../components/Footer'
import SistemInformasi from '../components/SistemInformasi'
import './halamanutama.css'

function HalamanUtama() {
  return (
    <div className='utama'>
      <Home/>
      <NavbarCom/>
      <SistemInformasi/>
      <Beranda/>
      <AlurPendaftaran/>
      <Persyaratan/>
      <FAQ/>
      <Footer/>
    </div>
  )
}

export default HalamanUtama