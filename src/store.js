import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slice/loginSlice";
import favoriteReducer from "./slice/favoriteSlice"
export const store = configureStore({
  reducer: { 
    login: loginReducer,
    favorite: favoriteReducer
  }
});