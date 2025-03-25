// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice.js';
import productReducer from './features/products/productSlice.js';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { attachInterceptors } from '../api/api';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable serializable check
    }),
});

// Attach your Axios interceptors after the store is created
attachInterceptors(store);

export const persistor = persistStore(store);
export default store;
