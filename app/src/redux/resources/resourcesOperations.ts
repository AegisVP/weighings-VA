import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../../utils/handleError';
import type {
  TypeApiError,
  TypeCropSchema,
  TypeLocationSchema,
  TypeMachineTypeSchema,
  TypeOperatorSchema,
  TypeMachineSchema,
} from '../types';
import type { TypeAppDispatch, TypeRootReduxState } from '../store';
import type { TypeMachineStateSchema } from './resourcesSlice';

type TypeResourcesApiResponse<T> = {
  items: T[];
  count: number;
};
type TypeThunkApiConfig = {
  state: TypeRootReduxState;
  dispatch: TypeAppDispatch;
  rejectValue: TypeApiError;
};

type TypeAddPayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
type TypeModifyPayload<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> & { id: string };
type TypeDeletePayload = { id: string };

export const loadLocations = createAsyncThunk<TypeResourcesApiResponse<TypeLocationSchema>, void, TypeThunkApiConfig>(
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

export const loadCrops = createAsyncThunk<TypeResourcesApiResponse<TypeCropSchema>, void, TypeThunkApiConfig>(
  'crops/load',
  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get('/crops')).data;
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

export const loadOperators = createAsyncThunk<TypeResourcesApiResponse<TypeOperatorSchema>, void, TypeThunkApiConfig>(
  'operators/load',
  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get('/operators')).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const addOperator = createAsyncThunk<
  TypeOperatorSchema,
  TypeAddPayload<TypeOperatorSchema>,
  TypeThunkApiConfig
>('operators/add', async (operator, { rejectWithValue }) => {
  try {
    return (await axios.post('/operators', operator)).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

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

export const loadMachineTypes = createAsyncThunk<
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

export const loadMachines = createAsyncThunk<
  TypeResourcesApiResponse<TypeMachineStateSchema>,
  void,
  TypeThunkApiConfig
>('machines/load', async (_, { rejectWithValue }) => {
  try {
    return (await axios.get('/machines')).data;
  } catch (err) {
    return rejectWithValue(handleError(err));
  }
});

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
