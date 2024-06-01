import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../Redux/authSlice';

export const Store = configureStore({
    reducer: {
      auth: authReducer,
    },
});