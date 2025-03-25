// src/redux/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../api/api.js';

// Async thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data; // expected to return { user, token, refreshToken }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for refreshing the auth token
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/refresh-token', { refreshToken });
      return response.data; // expected to return { token }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    setCredentials(state, action) {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
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
        state.user = action.payload.user || null;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
