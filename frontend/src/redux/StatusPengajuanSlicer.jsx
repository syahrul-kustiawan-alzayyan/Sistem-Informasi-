// src/redux/statusPengajuanSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Action untuk mengambil data pengajuan
export const fetchStatusPengajuan = createAsyncThunk(
  'statusPengajuan/fetchStatusPengajuan',
  async () => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    const response = await axios.get('http://localhost:3001/status-pengajuan', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

const statusPengajuanSlicer = createSlice({
  name: 'statusPengajuan',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusPengajuan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusPengajuan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatusPengajuan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {getStatusPengajuan} = statusPengajuanSlicer.actions;
export default statusPengajuanSlicer.reducer;
