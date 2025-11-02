import { createSlice } from '@reduxjs/toolkit';
import { store } from '../store';

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

export type TypeUserReduxState = TypeDefaultLoadingTypes & {
  isLoggedIn: boolean;
  isRefreshing: boolean;
  user: {
    name: string;
    username: string;
    features: string[];
  };
} & TypeUserLoginResponsePayload;

export const initialState: TypeUserReduxState = {
  ...defaultLoadingTypes,
  isLoggedIn: false,
  isRefreshing: false,
  token: '',
  refreshToken: '',
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
    resetError: (state: TypeUserReduxState) => ({ ...state, error: undefined }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, handleLoginUser)
      .addCase(registerUser.fulfilled, handleRegisterUser)
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(refreshUser.fulfilled, handleRefreshUser)
      .addCase(refreshUser.rejected, () => initialState)
      .addMatcher((action) => action.type.endsWith('/pending'), handlePending)
      .addMatcher((action) => action.type.endsWith('/fulfilled'), handleFulfill)
      .addMatcher((action) => action.type.endsWith('/rejected'), handleReject);
  },
});

export const userHasFeature = (feature: string) => {
  const userFeatures = selectUserFeatures(store.getState());
  return Array.isArray(userFeatures) && (userFeatures.includes(feature) || userFeatures.includes('ADMIN'));
};
export const userHasAllFeatures = (features: string[]) => {
  return features.every((feature) => userHasFeature(feature));
};
export const userHasAnyFeature = (features: string[]) => {
  return features.some((feature) => userHasFeature(feature));
};

export const { resetError } = userSlice.actions;

export default userSlice.reducer;
