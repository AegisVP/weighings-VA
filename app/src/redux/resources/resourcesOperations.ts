import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { handleError } from '../../utils/handleError';
import type {
  TypeApiError,
  TypeCropSchema,
  TypeLocationSchema,
  TypeMachineTypeSchema,
  TypeOperatorSchema,
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

// export const saveLocations = createAsyncThunk<TypeResourcesApiResponse<TypeLocationSchema>, void, TypeThunkApiConfig>(
//   'locations/save',
//   async (location, { rejectWithValue }) => {
//     try {
//       return (await axios.patch('/locations', location)).data;
//     } catch (err) {
//       return rejectWithValue(handleError(err));
//     }
//   }
// );

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

// export const saveCrops = createAsyncThunk<TypeResourcesApiResponse<TypeOperatorSchema>, void, TypeThunkApiConfig>(
//   'crops/save',
//   async (crop, { rejectWithValue }) => {
//     try {
//       return (await axios.patch('/crops', crop)).data;
//     } catch (err) {
//       return rejectWithValue(handleError(err));
//     }
//   }
// );

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

// export const saveOperators = createAsyncThunk<
//   TypeResourcesApiResponse<TypeMachineTypeSchema>,
//   void,
//   TypeThunkApiConfig
// >('operators/save', async (operator, { rejectWithValue }) => {
//   try {
//     return (await axios.patch('/operators', operator)).data;
//   } catch (err) {
//     return rejectWithValue(handleError(err));
//   }
// });

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

// export const saveMachineTypes = createAsyncThunk<
//   TypeResourcesApiResponse<TypeMachineTypeSchema>,
//   void,
//   TypeThunkApiConfig
// >('machinetypes/save', async (machineType, { rejectWithValue }) => {
//   try {
//     return (await axios.patch('/machine-types', machineType)).data;
//   } catch (err) {
//     return rejectWithValue(handleError(err));
//   }
// });

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

// export const saveMachines = createAsyncThunk<
//   TypeResourcesApiResponse<TypeMachineStateSchema>,
//   TypeMachineStateSchema,
//   TypeThunkApiConfig
// >('machines/save', async (machine, { rejectWithValue }) => {
//   try {
//     return (await axios.patch('/machines', machine)).data;
//   } catch (err) {
//     return rejectWithValue(handleError(err));
//   }
// });
