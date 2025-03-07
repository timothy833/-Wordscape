import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
const { VITE_API_BASE_URL } = import.meta.env;

// 從 cookie 中獲取 token
function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'WS_token') {
      return value;
    }
  }
  return null;
};

// 初始 token
const initialToken = getTokenFromCookie();
if (initialToken) {
  axios.defaults.headers.common.Authorization = `${initialToken}`;
  console.log('初始化 token 成功');
};

export const login = createAsyncThunk(
  'auth/login',
  async ( data , { rejectWithValue }) => {
    try {
      const url = `${VITE_API_BASE_URL}/users/login`;
      const loginRes = await axios.post( url, data, {
        headers: {
        "Content-Type": "application/json"
        }
      });
      const { token, id, username } = loginRes.data;
      console.log("login",loginRes);
      localStorage.setItem('WS_id', id);
      localStorage.setItem('WS_username', username);

      // token 有效期 3 小時
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 3);
      document.cookie = `WS_token=${token}; expires=${expiryDate.toUTCString()}; path=/; secure; SameSite=Strict`;
      
      // 設置 axios 預設 header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert('登入成功'); 
      return { token, username, id };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("登入失敗：帳號或密碼錯誤。");
      } else {
        alert("登入失敗，請稍後再試。");
      }

      return rejectWithValue(error.response?.data || "登入失敗，請稍後再試");
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    console.log('logout');
    try{
      const url = `${VITE_API_BASE_URL}/users/logout`;
      const logoutRes = await axios.post(url,{},{
        headers:{
          'Authorization': `Bearer ${initialToken}`
        }
      });
      
      console.log('logout',logoutRes);
      
      if(logoutRes.status == 200){
        document.cookie = "WS_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('WS_id');
        localStorage.removeItem('WS_username');
      };
      alert(logoutRes.data.message);
    
        
    }catch(error){
        console.log('error in logout', error.response?.data || error.message);
    };
    return null;
  }
);

// 初始 id username
export const initializeAuth = () => (dispatch) => {
  // 從 cookie 中讀取資訊
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  const id = getCookie('userId');
  const username = getCookie('username');
  
  // 如果 cookie 中有資訊，則更新 Redux store
  if (id && username) {
    dispatch(setUserInfo({ id, username }));
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken,
    isAuthorized: !!initialToken,
    loading: false,
    error: null,
    id: null,
    username: null,
  },reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.isAuthorized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '登入失敗，請稍後再試';
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.id = null;
        state.username = null;
        state.isAuthorized = false;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;