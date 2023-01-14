import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/userSlice';
import { weighingsApi } from './services/weighingsApi';

const presistedUserReducer = persistReducer(
  {
    key: 'user',
    storage,
    whitelist: ['token'],
  },
  userReducer
);

const rootReducer = combineReducers({
  weighings: weighingsApi.reducer,
  user: presistedUserReducer,
  // diary: diaryReducer,
  // diet: dietReducer,
  // modal: modalReducer,
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
  ],
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
