import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';



// 🔐 LOGIN
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/api/auth/login`, credentials);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// 📝 REGISTER
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/api/auth/register`, userData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// 👥 ADMIN: FETCH ALL USERS
export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const res = await axios.get(`${API}/api/auth/users`, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// 📦 UPDATE ADDRESS
export const saveUserAddress = createAsyncThunk('auth/saveUserAddress', async (address, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const res = await axios.put(`${API}/api/auth/address`, { address }, config);
    return res.data.address;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Address update failed');
  }
});

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
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Users
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

      // Save Address
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
