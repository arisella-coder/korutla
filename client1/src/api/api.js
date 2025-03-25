// src/api/api.js
import axios from 'axios';
import { refreshAuthToken, logout } from '../redux/features/auth/authSlice';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// This function attaches interceptors to the instance using the passed store
export const attachInterceptors = (store) => {
  // Request interceptor: attach the access token from the store
  instance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: try to refresh token on 401 errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const refreshTokenValue = store.getState().auth.refreshToken;
          if (refreshTokenValue) {
            const refreshResponse = await store.dispatch(
              refreshAuthToken(refreshTokenValue)
            );
            if (refreshResponse.payload) {
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.payload.token}`;
              return instance(originalRequest);
            }
          }
        } catch (err) {
          // If token refresh fails, log the user out
          store.dispatch(logout());
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default instance;
