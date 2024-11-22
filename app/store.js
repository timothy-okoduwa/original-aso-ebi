/** @format */

// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Add a default export for the store
export default store;
