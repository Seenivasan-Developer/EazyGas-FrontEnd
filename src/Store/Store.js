import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import authReducer, { logout } from '../Redux/authSlice';
import bookingReducer from '../Redux/bookingSlice';
import providerReducer from '../Redux/providerSlice';

// Define the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // Optionally, you can whitelist specific reducers to persist
   whitelist: ['auth', 'provider'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  provider: providerReducer,
  // Other reducers...
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific actions to prevent serialization errors
        ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Export the store and persistor
export const persistor = persistStore(store);
export default store;
