import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleError } from '../../../utils/handleError';

import type { TypeOperatorSchema } from '../../types';
import type {
  TypeAddPayload,
  TypeDeletePayload,
  TypeModifyPayload,
  TypeResourcesApiResponse,
  TypeThunkApiConfig,
} from '../resourcesOperations';

export const loadOperator = createAsyncThunk<TypeResourcesApiResponse<TypeOperatorSchema>, void, TypeThunkApiConfig>(
  'operators/load',
  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get('/operators')).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const addOperator = createAsyncThunk<TypeOperatorSchema, TypeAddPayload<TypeOperatorSchema>, TypeThunkApiConfig>(
  'operators/add',
  async (operator, { rejectWithValue }) => {
    try {
      return (await axios.post('/operators', operator)).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const modifyOperator = createAsyncThunk<
  TypeOperatorSchema,
  TypeModifyPayload<TypeOperatorSchema>,
  TypeThunkApiConfig
>('operators/modify', async (operator, { rejectWithValue }) => {
  try {
    return (await axios.patch('/operators', operator)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

export const deleteOperator = createAsyncThunk<{ id: string }, TypeDeletePayload, TypeThunkApiConfig>(
  'operators/delete',
  async (payload, { rejectWithValue }) => {
    try {
      await axios.delete('/operators', { data: payload });
      return payload;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
