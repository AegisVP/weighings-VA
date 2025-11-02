import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleError } from '../../../utils/handleError';

import type { TypeMachineTypeSchema } from '../../types';
import type {
  TypeAddPayload,
  TypeDeletePayload,
  TypeModifyPayload,
  TypeResourcesApiResponse,
  TypeThunkApiConfig,
} from '../resourcesOperations';

export const loadMachineType = createAsyncThunk<
  TypeResourcesApiResponse<TypeMachineTypeSchema>,
  void,
  TypeThunkApiConfig
>('machinetypes/load', async (_, { rejectWithValue }) => {
  try {
    return (await axios.get('/machine-types')).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const addMachineType = createAsyncThunk<
  TypeMachineTypeSchema,
  TypeAddPayload<TypeMachineTypeSchema>,
  TypeThunkApiConfig
>('machinetypes/add', async (machineType, { rejectWithValue }) => {
  try {
    return (await axios.post('/machine-types', machineType)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const modifyMachineType = createAsyncThunk<
  TypeMachineTypeSchema,
  TypeModifyPayload<TypeMachineTypeSchema>,
  TypeThunkApiConfig
>('machinetypes/modify', async (machineType, { rejectWithValue }) => {
  try {
    return (await axios.patch('/machine-types', machineType)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const deleteMachineType = createAsyncThunk<{ id: string }, TypeDeletePayload, TypeThunkApiConfig>(
  'machinetypes/delete',
  async (payload, { rejectWithValue }) => {
    try {
      await axios.delete('/machine-types', { data: payload });
      return payload;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
