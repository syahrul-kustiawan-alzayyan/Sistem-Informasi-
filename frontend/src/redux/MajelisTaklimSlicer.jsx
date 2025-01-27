import { createSlice } from '@reduxjs/toolkit';

const MajelisTaklimSlicer = createSlice({
    name: 'MajelisTaklim',
    initialState: {
        MajelisTaklim: [],
    },
    reducers: {
        getMajelisTaklim: (state, action) => {
            state.MajelisTaklim = action.payload.map(user => {
                return {
                    tanggal: user.tanggal,
                    namaPemohon: user.namaPemohon,
                    alamatPemohon: user.alamatPemohon,
                    noHpPemohon: user.noHpPemohon,
                    namaMajelis: user.namaMajelis,
                    alamatMajelis: user.alamatMajelis,
                    kecamatan: user.kecamatan,
                    kelurahan: user.kelurahan,
                    namaPimpinan: user.namaPimpinan,
                    noHpPimpinan: user.noHpPimpinan,
                    tahunBerdiri: user.tahunBerdiri,
                    jumlahJamaah: user.jumlahJamaah,
                    penyelenggara: user.penyelenggara,
                    suratPermohonan: user.suratPermohonan,
                    rekomendasiKUA: user.rekomendasiKUA,
                    susunanKepengurusan: user.susunanKepengurusan,
                    suratDomisili: user.suratDomisili,
                    daftarJemaah: user.daftarJemaah,
                    ktpPengurus: user.ktpPengurus,
                    ktpJamaah: user.ktpJamaah,
                    aktaYayasan: user.aktaYayasan,
                    proposalPengajuan: user.proposalPengajuan,
                    _id: user._id,  // Ensure _id is included to identify the item
                };
            });
        },
        addMajelisTaklim: (state, action) => {
            state.MajelisTaklim.push(action.payload);
        },
        deleteMajelisTaklim: (state, action) => {
            // Remove Majelis Taklim by ID
            state.MajelisTaklim = state.MajelisTaklim.filter(
                (item) => item._id !== action.payload
            );
        },
        uploadCertificateStart: (state) => {
            state.loading = true;
        },
        uploadCertificateSuccess: (state, action) => {
            // Perbarui data majelis setelah unggahan berhasil
            const updatedMajelis = state.MajelisTaklim.map((MajelisTaklim) =>
              MajelisTaklim._id === action.payload._id ? action.payload : MajelisTaklim
            );
            state.MajelisTaklim = updatedMajelis;
            state.loading = false;
            state.error = null;
        },
        uploadCertificateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});



export const { getMajelisTaklim, addMajelisTaklim, deleteMajelisTaklim,uploadCertificateStart,
    uploadCertificateSuccess,
    uploadCertificateFailure, } = MajelisTaklimSlicer.actions;
export default MajelisTaklimSlicer.reducer;

export const uploadCertificate = (_id, file) => async (dispatch) => {
    dispatch(uploadCertificateStart());
    try {
      const formData = new FormData();
      formData.append('sertifikat', file);
  
      const response = await axios.post(
        `http://localhost:3002/majelistaklim/upload-sertifikat/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      dispatch(uploadCertificateSuccess(response.data)); // `response.data` harus mencakup objek majelis yang diperbarui
    } catch (error) {
      dispatch(uploadCertificateFailure(error.message));
    }
};