import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { authHeader } from '../../utils/authHeader';
import { handleError } from '../../utils/handleError';

import type { TypeRootReduxState } from '../store';
import type {
  TypeUserRegisterRequestBody,
  TypeUserLoginRequestBody,
  TypeUserLoginResponsePayload,
  TypeUserRefreshResponsePayload,
} from '../../schema/userSchema';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TypeUserRegisterRequestBody, { rejectWithValue }) => {
    try {
      const response = await axios.post<TypeUserLoginResponsePayload>('/user/register', {
        name: data.name.trim(),
        username: data.username.trim().toLowerCase(),
        password: data.password.trim(),
      });

      authHeader.set(response.data.token);
      return response.data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TypeUserLoginRequestBody, { rejectWithValue }) => {
  try {
    const response = await axios.post<TypeUserLoginResponsePayload>('/user/login', {
      username: data.username.trim(),
      password: data.password.trim(),
    });

    authHeader.set(response.data.token);
    return response.data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post('/user/logout');
    authHeader.clear();
    return;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const refreshUser = createAsyncThunk('user/refresh', async (_, { rejectWithValue, getState }) => {
  try {
    const token = (getState() as TypeRootReduxState).auth.token;
    if (!token) throw new Error('No token found');
    authHeader.set(token);
    const { user } = (await axios.get<TypeUserRefreshResponsePayload>('/user/current')).data;
    const { features, name, username } = user;
    return { user: { name, username, features }, token };
  } catch (err) {
    authHeader.clear();
    return rejectWithValue(handleError(err));
  }
});
