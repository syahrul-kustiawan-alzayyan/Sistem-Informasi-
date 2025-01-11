import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk untuk memindahkan data
export const movePengajuanData = createAsyncThunk(
  'PengajuanBaru/movePengajuanData',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const url =
        status === 'approved'
          ? 'http://localhost:3001/approveMajelisTaklim'
          : `http://localhost:3001/pengajuanbaru/${id}`;

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
export const fetchPengajuanBaru = createAsyncThunk(
  'PengajuanBaru/fetchPengajuanBaru',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/pengajuanbaru');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const PengajuanBaruSlicer = createSlice({
  name: 'PengajuanBaru',
  initialState: {
    PengajuanBaru: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {
    addPengajuanBaru: (state, action) => {
      state.PengajuanBaru.push(action.payload);
    },
    removePengajuanBaru: (state, action) => {
      // Menghapus pengajuan berdasarkan _id
      state.PengajuanBaru = state.PengajuanBaru.filter(
        (pengajuan) => pengajuan._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Ketika pengambilan data berhasil
      .addCase(fetchPengajuanBaru.fulfilled, (state, action) => {
        state.PengajuanBaru = action.payload;
        state.status = 'succeeded';
      })
      // Ketika pengambilan data sedang diproses
      .addCase(fetchPengajuanBaru.pending, (state) => {
        state.status = 'loading';
      })
      // Ketika pengambilan data gagal
      .addCase(fetchPengajuanBaru.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Ketika data berhasil dipindahkan
      .addCase(movePengajuanData.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.PengajuanBaru = state.PengajuanBaru.filter((item) => item._id !== id);
        console.log(
          `Data with ID: ${id} moved to ${status === 'approved' ? 'approved list' : 'deleted'}.`
        );
      })

      // Ketika pemindahan data sedang diproses
      .addCase(movePengajuanData.pending, (state) => {
        state.status = 'loading';
      })

      // Ketika pemindahan data gagal
      .addCase(movePengajuanData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Ekspor actions dan reducer
export const { addPengajuanBaru, removePengajuanBaru } = PengajuanBaruSlicer.actions;
export default PengajuanBaruSlicer.reducer;
