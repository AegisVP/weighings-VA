import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { authHeader } from 'utils/authHeader';
import { constants } from 'constants';

axios.defaults.baseURL = `${constants.BASE_URL}/api/user`;

const tryCatchOperation = callFn => {
  return async (val, thunkAPI) => {
    try {
      await callFn(val);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || err.message);
    }
  };
};

const loginUserOperation = async val => {
  const response = await axios.post('/login', val);
  authHeader.set(response.data.token);
  return response.data;
};

export const loginUser = createAsyncThunk('user/login', tryCatchOperation(loginUserOperation));

export const registerUser = createAsyncThunk('user/register', async (val, thunkAPI) => {
  try {
    const response = await axios.post('/signup', val);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

// export const loginUser = createAsyncThunk('user/login', async (val, thunkAPI) => {
//   try {
//     const response = await axios.post('/login', val);
//     authHeader.set(response.data.token);
//     return response.data;
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response.data.message || err.message);
//   }
// });

export const logoutUser = createAsyncThunk('user/logout', async (val, thunkAPI) => {
  try {
    await axios.patch('/logout', val);
    authHeader.clear();
    return;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

export const refreshUser = createAsyncThunk('user/refresh', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/current');
    const { user } = response.data;
    const token = thunkAPI.getState().user.token;
    return { user, token };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

export const updateUser = createAsyncThunk('user/update', async (val, thunkAPI) => {
  try {
    const response = await axios.patch('/', val);
    const { subscription, email } = response.data;
    return { subscription, email };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});
