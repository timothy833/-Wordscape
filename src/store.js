import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from "./slice/favoriteSlice"
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: { 
    auth: authReducer,
    favorite: favoriteReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ serializableCheck: false }),
});