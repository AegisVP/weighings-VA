import axios from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../../../utils/handleError';

import type { TypeLocationSchema } from '../../types';
import type {
  TypeAddPayload,
  TypeDeletePayload,
  TypeModifyPayload,
  TypeResourcesApiResponse,
  TypeThunkApiConfig,
} from '../resourcesOperations';

export const loadLocation = createAsyncThunk<TypeResourcesApiResponse<TypeLocationSchema>, void, TypeThunkApiConfig>(
  'locations/load',
  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get('/locations')).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const addLocation = createAsyncThunk<TypeLocationSchema, TypeAddPayload<TypeLocationSchema>, TypeThunkApiConfig>(
  'locations/add',
  async (location, { rejectWithValue }) => {
    try {
      return (await axios.post('/locations', location)).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const modifyLocation = createAsyncThunk<
  TypeLocationSchema,
  TypeModifyPayload<TypeLocationSchema>,
  TypeThunkApiConfig
>('locations/modify', async (location, { rejectWithValue }) => {
  try {
    return (await axios.patch('/locations', location)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const deleteLocation = createAsyncThunk<{ id: string }, TypeDeletePayload, TypeThunkApiConfig>(
  'locations/delete',
  async (payload, { rejectWithValue }) => {
    try {
      await axios.delete('/locations', { data: payload });
      return payload;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
