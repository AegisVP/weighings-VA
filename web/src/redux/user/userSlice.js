import { createSlice } from '@reduxjs/toolkit';
import { handlePending, handleFulfilled, handleRejected } from '../utils/defaultHandlers';
import {
  handleLoginUser,
  handleRegisterUser,
  handleLogoutUser,
  handleRefreshUser,
} from './userHandlers';
import { loginUser, logoutUser, refreshUser, registerUser } from './userOperations';

export const initialUserState = {
  name: null,
  email: null,
  token: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, handleLoginUser)
      .addCase(registerUser.fulfilled, handleRegisterUser)
      .addCase(logoutUser.fulfilled, handleLogoutUser)
      .addCase(refreshUser.fulfilled, handleRefreshUser)
      .addMatcher(action => action.type.endsWith('/pending'), handlePending)
      .addMatcher(action => action.type.endsWith('/fulfilled'), handleFulfilled)
      .addMatcher(action => action.type.endsWith('/rejected'), handleRejected);
  },
});

export default userSlice.reducer;
