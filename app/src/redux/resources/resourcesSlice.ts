import { createSlice } from '@reduxjs/toolkit';
import type { TypeDefaultLoadingTypes } from '../defaults/const';
import type {
  TypeCropSchema,
  TypeLocationSchema,
  TypeMachineSchema,
  TypeMachineTypeSchema,
  TypeOperatorSchema,
} from '../types';
import {
  loadCrops,
  loadLocations,
  loadMachines,
  loadMachineTypes,
  loadOperators,
  // saveCrops,
  // saveLocations,
  // saveMachines,
  // saveMachineTypes,
  // saveOperators,
} from './resourcesOperations';
import { handlePending, handleReject, handleResourceLoaded } from './resourcesHandlers';

export type ResourceStore<T> = TypeDefaultLoadingTypes & {
  items: T[];
  count?: number;
};

export type TypeMachineStateSchema = Omit<TypeMachineSchema, 'type'> & { type: string };

export type TypeResourcesReduxState = {
  crop: ResourceStore<TypeCropSchema>;
  operator: ResourceStore<TypeOperatorSchema>;
  machineType: ResourceStore<TypeMachineTypeSchema>;
  machine: ResourceStore<TypeMachineStateSchema>;
  location: ResourceStore<TypeLocationSchema>;
};

const initialState: TypeResourcesReduxState = {
  crop: {
    isLoading: false,
    error: null,
    items: [],
  },
  operator: {
    isLoading: false,
    error: null,
    items: [],
  },
  machineType: {
    isLoading: false,
    error: null,
    items: [],
  },
  machine: {
    isLoading: false,
    error: null,
    items: [],
  },
  location: {
    isLoading: false,
    error: null,
    items: [],
  },
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(saveLocations.pending, handlePending('location'))
      // .addCase(saveLocations.rejected, handleReject('location'))
      .addCase(loadLocations.pending, handlePending('location'))
      .addCase(loadLocations.fulfilled, handleResourceLoaded<TypeLocationSchema>('location'))
      .addCase(loadLocations.rejected, handleReject('location'))
      // .addCase(saveCrops.pending, handlePending('crop'))
      // .addCase(saveCrops.rejected, handleReject('crop'))
      .addCase(loadCrops.pending, handlePending('crop'))
      .addCase(loadCrops.fulfilled, handleResourceLoaded<TypeCropSchema>('crop'))
      .addCase(loadCrops.rejected, handleReject('crop'))
      // .addCase(saveMachineTypes.pending, handlePending('machineType'))
      // .addCase(saveMachineTypes.rejected, handleReject('machineType'))
      .addCase(loadMachineTypes.pending, handlePending('machineType'))
      .addCase(loadMachineTypes.fulfilled, handleResourceLoaded<TypeMachineTypeSchema>('machineType'))
      .addCase(loadMachineTypes.rejected, handleReject('machineType'))
      // .addCase(saveOperators.pending, handlePending('operator'))
      // .addCase(saveOperators.rejected, handleReject('operator'))
      .addCase(loadOperators.pending, handlePending('operator'))
      .addCase(loadOperators.fulfilled, handleResourceLoaded<TypeOperatorSchema>('operator'))
      .addCase(loadOperators.rejected, handleReject('operator'))
      // .addCase(saveMachines.pending, handlePending('machine'))
      // .addCase(saveMachines.rejected, handleReject('machine'))
      .addCase(loadMachines.pending, handlePending('machine'))
      .addCase(loadMachines.fulfilled, handleResourceLoaded<TypeMachineStateSchema>('machine'))
      .addCase(loadMachines.rejected, handleReject('machine'));
  },
});

export default resourcesSlice.reducer;
