import React from 'react';
import './tabelpengajuanbaru.css';
import { useDispatch, useSelector } from 'react-redux';
import { getMajelisTaklim } from '../redux/MajelisTaklimSlicer';


const TabelPengajuanBaru = () => {
  const dispatch = useDispatch();
  const MajelisTaklim = useSelector(state => state.MajelisTaklim.MajelisTaklim)

  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const response = await axios.get('http://localhost:3001/majelistaklim');
        dispatch(getMajelisTaklim(response.data));
      } catch(err){
          console.log(err)
      }
    }
    fetchData();
  },[])


  return (
    <div className="table-responsive table-container">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="fixed-left">Nama Majelis Taklim</th>
            <th>Tanggal</th>
            <th>Nama Pemohon</th>
            <th>Alamat Pemohon</th>
            <th>No HP Pemohon</th>
            <th>Kecamatan</th>
            <th>Kelurahan</th>
            <th>Nama Pimpinan</th>
            <th>No HP Pimpinan</th>
            <th>Tahun Berdiri</th>
            <th>Jumlah Jamaah</th>
            <th>Penyelenggara</th>
            {/* PDF Columns */}
            <th>Surat Permohonan</th>
            <th>Rekomendasi KUA</th>
            <th>Susunan Kepengurusan</th>
            <th>Surat Domisili</th>
            <th>Daftar Jamaah</th>
            <th>KTP Pengurus</th>
            <th>KTP Jamaah</th>
            <th>Akta Yayasan</th>
            <th>Proposal Pengajuan</th>
          </tr>
        </thead>
        <tbody>
          {MajelisTaklim.map((item, index) => (
            <tr key={index}>
              <td className="fixed-left">{item.namaMajelis}</td>
              <td>{item.tanggal}</td>
              <td>{item.namaPemohon}</td>
              <td>{item.alamatPemohon}</td>
              <td>{item.noHpPemohon}</td>
              <td>{item.kecamatan}</td>
              <td>{item.kelurahan}</td>
              <td>{item.namaPimpinan}</td>
              <td>{item.noHpPimpinan}</td>
              <td>{item.tahunBerdiri}</td>
              <td>{item.jumlahJamaah}</td>
              <td>{item.penyelenggara}</td>
              {/* PDF Columns with View Buttons */}
              <td>
                {item.suratPermohonan ? (
                  <a href={item.suratPermohonan} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.rekomendasiKUA ? (
                  <a href={item.rekomendasiKUA} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.susunanKepengurusan ? (
                  <a href={item.susunanKepengurusan} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.suratDomisili ? (
                  <a href={item.suratDomisili} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.daftarJamaah ? (
                  <a href={item.daftarJamaah} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.ktpPengurus ? (
                  <a href={item.ktpPengurus} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.ktpJamaah ? (
                  <a href={item.ktpJamaah} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.aktaYayasan ? (
                  <a href={item.aktaYayasan} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                {item.proposalPengajuan ? (
                  <a href={item.proposalPengajuan} target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-info btn-sm">View</button>
                  </a>
                ) : (
                  'No File'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelPengajuanBaru;
