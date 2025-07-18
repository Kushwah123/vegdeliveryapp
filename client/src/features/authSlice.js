// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 🔐 LOGIN
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/api/auth/login`, credentials);
    console.log(res.data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

// 📝 REGISTER
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/api/auth/register`, userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Register failed');
  }
});

// 👥 ADMIN: FETCH ALL USERS
export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = {
      headers: { Authorization: `Bearer ${user?.token}` },
    };
    const res = await axios.get(`${API}/api/auth/users`, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

// 🏠 UPDATE ADDRESS
export const saveUserAddress = createAsyncThunk('auth/saveUserAddress', async (address, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = {
      headers: { Authorization: `Bearer ${user?.token}` },
    };
    const res = await axios.put(`${API}/api/auth/address`, { address }, config);
    return res.data.address;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Address update failed');
  }
});

// ✏️ UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updatedData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await axios.put(`${API}/api/users/profile`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Profile update failed');
    }
  }
);

// 🔥 SLICE STARTS
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
    users: [],
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📝 REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 👥 ADMIN USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📦 SAVE ADDRESS
      .addCase(saveUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.address = action.payload;
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(saveUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
