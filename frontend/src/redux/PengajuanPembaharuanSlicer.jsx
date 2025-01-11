import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk untuk memindahkan data
export const movePengajuanPembaharuan = createAsyncThunk(
  'PengajuanPembaharuan/movePengajuanPembaharuan',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const url =
        status === 'approved'
          ? 'http://localhost:3001/approveMajelisTaklim'
          : `http://localhost:3001/pengajuanpembaharuan/${id}`;

      const method = status === 'approved' ? 'POST' : 'DELETE';

      const response = await axios({
        method,
        url,
        data: { _id: id },
        headers: { 'Content-Type': 'application/json' },
      });

      return { id, status }; // Kirim data status dan ID yang dipindahkan
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Async thunk untuk mengambil data pengajuan baru
export const fetchPengajuanPembaharuan = createAsyncThunk(
  'PengajuanPembaharuan/fetchPengajuanPembaharuan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/pengajuanpembaharuan');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const PengajuanPembaharuanSlicer = createSlice({
  name: 'PengajuanPembaharuan',
  initialState: {
    PengajuanPembaharuan: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    addPengajuanPembaharuan: (state, action) => {
      state.PengajuanPembaharuan.push(action.payload);
    },
    removePengajuanPembaharuan: (state, action) => {
      // Menghapus pengajuan berdasarkan _id
      state.PengajuanPembaharuan = state.PengajuanPembaharuan.filter(
        (pengajuan) => pengajuan._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Ketika pengambilan data berhasil
      .addCase(fetchPengajuanPembaharuan.fulfilled, (state, action) => {
        state.PengajuanPembaharuan = action.payload;
        state.status = 'succeeded';
      })
      // Ketika pengambilan data sedang diproses
      .addCase(fetchPengajuanPembaharuan.pending, (state) => {
        state.status = 'loading';
      })
      // Ketika pengambilan data gagal
      .addCase(fetchPengajuanPembaharuan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Ketika data berhasil dipindahkan
      .addCase(movePengajuanPembaharuan.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.PengajuanPembaharuan = state.PengajuanPembaharuan.filter((item) => item._id !== id);
        console.log(
          `Data with ID: ${id} moved to ${status === 'approved' ? 'approved list' : 'deleted'}.`
        );
      })

      // Ketika pemindahan data sedang diproses
      .addCase(movePengajuanPembaharuan.pending, (state) => {
        state.status = 'loading';
      })

      // Ketika pemindahan data gagal
      .addCase(movePengajuanPembaharuan.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Ekspor actions dan reducer
export const { addPengajuanPembaharuan, removePengajuanPembaharuan } = PengajuanPembaharuanSlicer.actions;
export default PengajuanPembaharuanSlicer.reducer;
