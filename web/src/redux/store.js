import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from 'redux/user/userSlice';
import entriesReducer from 'redux/entries/entriesSlice';
import { weighingsApi } from 'redux/services/weighingsAPI';
import { constantsApi } from './services/constantsAPI';

const persistedUserReducer = persistReducer(
  {
    key: 'auth',
    storage,
    whitelist: ['token'],
  },
  userReducer
);

const persistedEntriesReducer = persistReducer(
  {
    key: 'entries',
    storage,
    whitelist: ['items'],
  },
  entriesReducer
);

const rootReducer = combineReducers({
  constants: constantsApi.reducer,
  weighings: weighingsApi.reducer,
  entries: persistedEntriesReducer,
  auth: persistedUserReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    weighingsApi.middleware,
    constantsApi.middleware,
  ],
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
