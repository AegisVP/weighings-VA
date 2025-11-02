import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type Persistor,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/userSlice';
import resourcesReducer from './resources/resourcesSlice';
import weighingReducer from './weighings/weighingsSlice';

const persistedUserReducer = persistReducer(
  {
    key: 'auth',
    storage,
    whitelist: ['token'],
  },
  userReducer
);

const rootReducer = combineReducers({
  auth: persistedUserReducer,
  resources: resourcesReducer,
  weighings: weighingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export const waitForRehydration = (p: Persistor) =>
  new Promise<void>((resolve) => {
    try {
      const state = p.getState();
      if (state && state.bootstrapped) return resolve();
    } catch {
      // ignore and subscribe
    }
    const unsub = p.subscribe(() => {
      const s = p.getState();
      if (s && s.bootstrapped) {
        unsub();
        resolve();
      }
    });
  });

setupListeners(store.dispatch);

export type TypeRootReduxState = ReturnType<typeof store.getState>;
export type TypeAppDispatch = typeof store.dispatch;
export type TypeAppStore = typeof store;
