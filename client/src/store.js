// frontend/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';
import productReducer from './features/productSlice';
import orderReducer from './features/orderSlice'; // ✅ import orderSlice
import deliveryChargeReducer from './features/deliveryChargeSlice'; // ✅ newly added

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer, // ✅ add to store
    deliveryCharge: deliveryChargeReducer,
  },
});

export default store;
