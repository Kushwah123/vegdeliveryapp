import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// ✅ Fetch Cart from backend on page load
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
    const res = await axios.get(`${API}/api/cart`, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ✅ Add/Update item and sync with backend
export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async (product, thunkAPI) => {
    try {
      const { cart, auth } = thunkAPI.getState();

      // Check if product already exists
      const exist = cart.items.find((i) => i.productId === product.productId);
      let updatedCart;

      if (exist) {
        updatedCart = cart.items.map((i) =>
          i.productId === product.productId ? product : i
        );
      } else {
        updatedCart = [...cart.items, product];
      }

      const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
      const res = await axios.put(`${API}/api/cart`, { items: updatedCart }, config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Manually update full cart (like after quantity change)
export const updateCart = createAsyncThunk('cart/updateCart', async (items, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState();
    const config = { headers: { Authorization: `Bearer ${auth.user.token}` } };
    const res = await axios.put(`${API}/api/cart`, { items }, config);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  },
});

export const { removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
