import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';



// 🔽 PLACE ORDER
export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.post(`${API}/api/orders`, orderData, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 FETCH USER'S OWN ORDERS
export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.get(`${API}/api/orders/user`, config);
    console.log(res.data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 FETCH ALL ORDERS (ADMIN)
export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.get(`${API}/api/orders/allorders`, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({ orderId, status }, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.put(`${API}/api/orders/${orderId}/status`, { status }, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 FETCH ALL USERS (ADMIN)
export const fetchAllUsers = createAsyncThunk('orders/fetchAllUsers', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.get(`${API}/api/auth/users`, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 FETCH SPECIFIC USER ORDERS (ADMIN)
export const fetchUserOrders = createAsyncThunk('orders/fetchUserOrders', async (userId, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const res = await axios.get(`${API}/api/orders/user/${userId}`, config); // <-- corrected route
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 PLACE ONLINE ORDER WITH SCREENSHOT
export const placeOnlineOrderWithScreenshot = createAsyncThunk(
  'orders/placeOnlineOrderWithScreenshot',
  async ({ formData }, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState().auth;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post(`${API}/api/orders/online-payment`, formData, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ NEW: Verify or reject online payment
export const verifyPaymentStatus = createAsyncThunk(
  'orders/verifyPayment',
  async ({ orderId, paymentVerified }, thunkAPI) => {
    try {
      const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put(`/api/orders/verify-payment/${orderId}`, { paymentVerified },config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || 'Verification failed');
    }
  }
);

// 🔽 DELETE ORDER
export const deleteOrderById = createAsyncThunk('orders/deleteOrderById', async (orderId, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().auth;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    await axios.delete(`${API}/api/orders/${orderId}`, config);
    return orderId;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    myOrders: [],
    userOrders: [],
    users: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ✅ PLACE ORDER
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ MY ORDERS
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ALL ORDERS (ADMIN)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
// ✅ PLACE ONLINE ORDER WITH SCREENSHOT
.addCase(placeOnlineOrderWithScreenshot.pending, (state) => {
  state.loading = true;
  state.success = false;
  state.error = null;
})
.addCase(placeOnlineOrderWithScreenshot.fulfilled, (state, action) => {
  state.loading = false;
  state.success = true;
  state.orders.push(action.payload);
})
.addCase(placeOnlineOrderWithScreenshot.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

      // ✅ UPDATE ORDER STATUS
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updated._id ? updated : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ verifyPaymentStatus
      .addCase(verifyPaymentStatus.fulfilled, (state, action) => {
        const index = state.orders.orders?.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders.orders[index] = action.payload;
        }
      })

      // ✅ DELETE ORDER
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })

      // ✅ FETCH USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ FETCH USER ORDERS (ADMIN)
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
