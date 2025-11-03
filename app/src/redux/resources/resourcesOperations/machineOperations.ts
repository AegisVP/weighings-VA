import axios from 'axios';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../../../utils/handleError';

import type { TypeMachineSchema } from '../../types';
import type {
  TypeAddPayload,
  TypeDeletePayload,
  TypeModifyPayload,
  TypeResourcesApiResponse,
  TypeThunkApiConfig,
} from '../resourcesOperations';

export const loadMachine = createAsyncThunk<TypeResourcesApiResponse<TypeMachineSchema>, void, TypeThunkApiConfig>(
  'machines/load',
  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get('/machines')).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const addMachine = createAsyncThunk<
  TypeMachineSchema,
  TypeAddPayload<TypeMachineSchema> & { type: string },
  TypeThunkApiConfig
>('machines/add', async (machine, { rejectWithValue }) => {
  try {
    return (await axios.post('/machines', machine)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const modifyMachine = createAsyncThunk<
  TypeMachineSchema,
  TypeModifyPayload<TypeMachineSchema> & { type?: string },
  TypeThunkApiConfig
>('machines/modify', async (machine, { rejectWithValue }) => {
  try {
    return (await axios.patch('/machines', machine)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const deleteMachine = createAsyncThunk<{ id: string }, TypeDeletePayload, TypeThunkApiConfig>(
  'machines/delete',
  async (payload, { rejectWithValue }) => {
    try {
      await axios.delete('/machines', { data: payload });
      return payload;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
