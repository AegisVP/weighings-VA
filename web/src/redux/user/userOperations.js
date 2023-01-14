import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authHeader } from '../utils/authHeader';
import { constants } from '../../constants';

axios.defaults.baseURL = `${constants.apiServerAddress}/api`;

export const loginUser = createAsyncThunk('user/login', async (val, thunkAPI) => {
  try {
    const response = await axios.post('/user/login', val);
    authHeader.set(response.data.token);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

export const registerUser = createAsyncThunk('user/register', async (val, thunkAPI) => {
  try {
    const response = await axios.post('/user', val);
    authHeader.set(response.data.token);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

export const logoutUser = createAsyncThunk('user/logout', async (val, thunkAPI) => {
  try {
    const response = await axios.patch('/user/logout', val);
    authHeader.clear();
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

export const refreshUser = createAsyncThunk('user/refresh', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/user/current');
    const { name, email, params } = response.data;
    const token = thunkAPI.getState().user.token;
    return { name, email, token, params };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});

export const fetchParams = createAsyncThunk('user/fetchParams', async (val, thunkAPI) => {
  try {
    const response = await axios.get('/user/current', val);
    return response.data?.params;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || err.message);
  }
});
