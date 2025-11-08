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
import { machineSchema } from '../../../../../api/src/schema/machineSchema';

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

export const addMachine = createAsyncThunk<TypeMachineSchema, TypeAddPayload<TypeMachineSchema>, TypeThunkApiConfig>(
  'machines/add',
  async (machine, { rejectWithValue }) => {
    try {
      console.log('Adding machine:', machine);
      const machineData = machineSchema
        .partial({ id: true, createdAt: true, updatedAt: true, deletedAt: true })
        .parse(machine);
      console.log({ machineData });
      return (await axios.post('/machines', machineData)).data;
    } catch (err) {
      console.log({ err });
      return rejectWithValue(handleError(err));
    }
  }
);

export const modifyMachine = createAsyncThunk<
  TypeMachineSchema,
  TypeModifyPayload<TypeMachineSchema>,
  TypeThunkApiConfig
>('machines/modify', async (machine, { rejectWithValue }) => {
  try {
    const machineData = machineSchema.partial().required({ id: true }).parse(machine);
    return (await axios.patch('/machines', machineData)).data;
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
