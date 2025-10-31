import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { parseFeatures, getActiveFeatures } from '../../utils/getFeatures';
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
        username: data.username.trim().toLocaleLowerCase(),
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

// type RefreshUserResp = Pick<TypeUserReduxState, 'user' | 'token'>;
export const refreshUser = createAsyncThunk('user/refresh', async (_, { rejectWithValue, getState }) => {
  try {
    const token = (getState() as TypeRootReduxState).auth.token;
    console.log('setting header', { token });
    authHeader.set(token);
    const { user } = (await axios.get<TypeUserRefreshResponsePayload>('/user/current')).data;
    console.log('got user', { user });
    const { name, username } = user;
    const features = parseFeatures(getActiveFeatures(user));
    return { user: { name, username, features }, token };
  } catch (err) {
    console.log('clearing header', err);
    authHeader.clear();
    return rejectWithValue(handleError(err));
  }
});
