import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authReducer } from './auth/authSlice';
import { weighingsReducer } from './weighings/weighingsSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};
const presistedAuthReducer = persistReducer(authPersistConfig, authReducer); 

const rootReducer = combineReducers({
  weighings: weighingsReducer,
  auth: presistedAuthReducer,
});

export const store = configureStore(
  {
    reducer: rootReducer,

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  },
  // applyMiddleware(contactsAPI.middleware),
);

export const persistor = persistStore(store);

setupListeners(store.dispatch);
