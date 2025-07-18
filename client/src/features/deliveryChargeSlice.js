// src/features/deliveryChargeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 🔽 FETCH ALL DELIVERY CHARGES
export const fetchDeliveryCharges = createAsyncThunk(
  'deliveryCharges/fetchAll',
  async (_, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState().auth;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API}/api/deliverycharges`, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔽 CREATE A NEW DELIVERY CHARGE
export const createDeliveryCharge = createAsyncThunk(
  'deliveryCharges/create',
  async ({ colony, charge }, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState().auth;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post(`${API}/api/deliverycharges`, { colony, charge }, config);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔽 DELETE DELIVERY CHARGE
export const deleteDeliveryCharge = createAsyncThunk(
  'deliveryCharges/delete',
  async (id, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState().auth;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API}/api/deliverycharges/${id}`, config);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const deliveryChargeSlice = createSlice({
  name: 'deliveryCharges',
  initialState: {
    charges: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 FETCH
      .addCase(fetchDeliveryCharges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryCharges.fulfilled, (state, action) => {
        state.loading = false;
        state.charges = action.payload;
        console.log("charges fetched", action.payload);
      })
      .addCase(fetchDeliveryCharges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ CREATE
      .addCase(createDeliveryCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDeliveryCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.charges.push(action.payload);
      })
      .addCase(createDeliveryCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ DELETE
      .addCase(deleteDeliveryCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeliveryCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.charges = state.charges.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteDeliveryCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deliveryChargeSlice.reducer;
