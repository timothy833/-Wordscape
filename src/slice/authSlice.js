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
  axios.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
  console.log('初始化 token 成功', initialToken);
};

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const url = `${VITE_API_BASE_URL}/users/login`;
      const loginRes = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      const { token, id, username } = loginRes.data;
      console.log("login", loginRes);
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
  async (_, { getState, rejectWithValue }) => {
    console.log('logout');
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('沒有可用的 token，無法登出');
      }
      const url = `${VITE_API_BASE_URL}/users/logout`;
      const logoutRes = await axios.post(url, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('logout', logoutRes);

      if (logoutRes.status === 200) {
        // 成功登出，清除數據
        document.cookie = "WS_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('WS_id');
        localStorage.removeItem('WS_username');
        localStorage.removeItem('WS_avatar');

        alert(logoutRes.data.message || '登出成功');
        return { success: true };
      } else {
        // 不是 200 狀態碼，視為失敗
        alert('登出失敗，請稍後再試');
        return rejectWithValue('伺服器回應非成功狀態');
      }

    } catch (error) {
      console.log('error in logout', error.response?.data || error.message);

      if (error.code === 'ECONNABORTED') {
        alert('登出請求超時，請檢查網絡連接並稍後再試');
      } else {
        alert('登出失敗：' + (error.response?.data?.message || '請稍後再試'));
      }

      return rejectWithValue(error.response?.data || error.message);
    };
  }
);

// 獲取用戶頭像
export const fetchUserAvatar = createAsyncThunk(
  'auth/fetchUserAvatar',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const userId = getState().auth.id;

      if (!token || !userId) {
        return rejectWithValue('未登入狀態');
      }

      const url = `${VITE_API_BASE_URL}/users/${userId}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const avatarUrl = response.data.profile_picture; // 根據你的 API 回應結構調整
      const updateUsername = response.data.username;

      // 保存到 localStorage
      localStorage.setItem('WS_avatar', avatarUrl);
      localStorage.setItem('WS_avatar', updateUsername);

      return { avatarUrl, updateUsername };
    } catch (error) {
      console.log('獲取頭像失敗', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || '獲取頭像失敗');
    }
  }
);

// 初始 id username
export const initializeAuth = () => (dispatch) => {

  const id = localStorage.getItem('WS_id');
  const username = localStorage.getItem('WS_username');
  const token = getTokenFromCookie();

  if (id && username && token) {
    dispatch(setUserInfo({ id, username }));
    dispatch(updateToken(token)); // 更新 token
  }
};

export const updateToken = (token) => (dispatch) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  dispatch({
    type: 'auth/updateToken',
    payload: token
  });
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
    userAvatar: null,
  }, reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserInfo: (state, action) => {
      const { id, username, userAvatar } = action.payload;
      state.id = id;
      state.username = username;
      state.userAvatar = userAvatar;
      state.isAuthorized = !!id;
    },
    setAvatar: (state, action) => {
      state.userAvatar = action.payload;
      localStorage.setItem('WS_avatar', action.payload);
    },
    updateUserInfo: (state, action) => {
      state.username = action.payload.username;
      state.userAvatar = action.payload.userAvatar;
    },
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
        state.userAvatar = null;
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
        state.userAvatar = null;
      })
      .addCase(fetchUserAvatar.fulfilled, (state, action) => {
        state.userAvatar = action.payload.avatarUrl;
        state.username = action.payload.updateUsername;
      })
  }
});

export const { clearError, setUserInfo, setAvatar, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;