import { createSlice } from '@reduxjs/toolkit';
import { store, type TypeRootReduxState } from '../store';

import { loginUser, logoutUser, refreshUser, registerUser } from './userOperations';
import { selectUserFeatures } from './userSelectors';
import {
  handlePending,
  handleLoginUser,
  handleFulfill,
  handleReject,
  handleRegisterUser,
  handleRefreshUser,
} from './userHandlers';
import { defaultLoadingTypes } from '../defaults/const';

import type { TypeDefaultLoadingTypes } from '../defaults/const';
import type { TypeUserLoginResponsePayload } from '../../schema/userSchema';
import type { TypeFeatureSchema } from '../types';

export type TypeUserReduxState = TypeDefaultLoadingTypes & {
  isLoggedIn: boolean;
  isRefreshing: boolean;
  locale: 'en' | 'ua';
  user: {
    name: string;
    username: string;
    features: TypeFeatureSchema[];
  };
} & TypeUserLoginResponsePayload;

export const initialState: TypeUserReduxState = {
  ...defaultLoadingTypes,
  isLoggedIn: false,
  isRefreshing: false,
  locale: 'ua',
  token: '',
  user: {
    name: '',
    username: '',
    features: [],
  },
} as const;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLocale: (state: TypeUserReduxState, action: { payload: 'en' | 'ua' }) => ({ ...state, locale: action.payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, handleLoginUser)
      .addCase(registerUser.fulfilled, handleRegisterUser)
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(refreshUser.fulfilled, handleRefreshUser)
      .addCase(refreshUser.rejected, () => initialState)
      .addMatcher(({ type }) => type.startsWith('user/') && type.endsWith('/pending'), handlePending)
      .addMatcher(({ type }) => type.startsWith('user/') && type.endsWith('/fulfilled'), handleFulfill)
      .addMatcher(({ type }) => type.startsWith('user/') && type.endsWith('/rejected'), handleReject);
  },
});

export const userHasFeature = (feature?: string, state?: TypeRootReduxState) => {
  const userFeatures = selectUserFeatures(state || store.getState());
  return userFeatures.some(({ name }) => name === (feature || 'ADMIN') || name === 'ADMIN');
};
export const userHasAllFeatures = (features: string[], state?: TypeRootReduxState) => {
  const currentState = state || store.getState();
  return features.every((feature) => userHasFeature(feature, currentState));
};
export const userHasAnyFeature = (features: string[], state?: TypeRootReduxState) => {
  const currentState = state || store.getState();
  return features.some((feature) => userHasFeature(feature, currentState));
};

export const { setLocale } = userSlice.actions;

export default userSlice.reducer;
