import axios from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../../../utils/handleError';

import type { TypeCropSchema } from '../../types';
import type {
  TypeAddPayload,
  TypeDeletePayload,
  TypeModifyPayload,
  TypeResourcesApiResponse,
  TypeThunkApiConfig,
} from '../resourcesOperations';

export const loadCrop = createAsyncThunk<TypeResourcesApiResponse<TypeCropSchema>, void, TypeThunkApiConfig>(
  'crops/load',
  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get('/crops?deleted=false')).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const addCrop = createAsyncThunk<TypeCropSchema, TypeAddPayload<TypeCropSchema>, TypeThunkApiConfig>(
  'crops/add',
  async (crop, { rejectWithValue }) => {
    try {
      return (await axios.post('/crops', crop)).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const modifyCrop = createAsyncThunk<TypeCropSchema, TypeModifyPayload<TypeCropSchema>, TypeThunkApiConfig>(
  'crops/modify',
  async (crop, { rejectWithValue }) => {
    try {
      return (await axios.patch('/crops', crop)).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const deleteCrop = createAsyncThunk<{ id: string }, TypeDeletePayload, TypeThunkApiConfig>(
  'crops/delete',
  async (payload, { rejectWithValue }) => {
    try {
      await axios.delete('/crops', { data: payload });
      return payload;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
