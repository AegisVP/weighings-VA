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
  addCrop,
  modifyCrop,
  deleteCrop,
  addLocation,
  modifyLocation,
  deleteLocation,
  addMachine,
  modifyMachine,
  deleteMachine,
  addMachineType,
  modifyMachineType,
  deleteMachineType,
  addOperator,
  modifyOperator,
  deleteOperator,
} from './resourcesOperations';
import {
  handlePending,
  handleReject,
  handleResourceLoaded,
  handleResourceAdded,
  handleResourceModified,
  handleResourceDeleted,
} from './resourcesHandlers';

export type ResourceStore<T> = TypeDefaultLoadingTypes & {
  items: T[];
  count?: number;
};

export type TypeMachineStateSchema = Omit<TypeMachineSchema, 'type'> & { id: string; type: string };

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
      // Location operations
      .addCase(loadLocations.pending, handlePending('location'))
      .addCase(loadLocations.fulfilled, handleResourceLoaded<TypeLocationSchema>('location'))
      .addCase(loadLocations.rejected, handleReject('location'))
      .addCase(addLocation.pending, handlePending('location'))
      .addCase(addLocation.fulfilled, handleResourceAdded<TypeLocationSchema>('location'))
      .addCase(addLocation.rejected, handleReject('location'))
      .addCase(modifyLocation.pending, handlePending('location'))
      .addCase(modifyLocation.fulfilled, handleResourceModified<TypeLocationSchema>('location'))
      .addCase(modifyLocation.rejected, handleReject('location'))
      .addCase(deleteLocation.pending, handlePending('location'))
      .addCase(deleteLocation.fulfilled, handleResourceDeleted('location'))
      .addCase(deleteLocation.rejected, handleReject('location'))
      // Crop operations
      .addCase(loadCrops.pending, handlePending('crop'))
      .addCase(loadCrops.fulfilled, handleResourceLoaded<TypeCropSchema>('crop'))
      .addCase(loadCrops.rejected, handleReject('crop'))
      .addCase(addCrop.pending, handlePending('crop'))
      .addCase(addCrop.fulfilled, handleResourceAdded<TypeCropSchema>('crop'))
      .addCase(addCrop.rejected, handleReject('crop'))
      .addCase(modifyCrop.pending, handlePending('crop'))
      .addCase(modifyCrop.fulfilled, handleResourceModified<TypeCropSchema>('crop'))
      .addCase(modifyCrop.rejected, handleReject('crop'))
      .addCase(deleteCrop.pending, handlePending('crop'))
      .addCase(deleteCrop.fulfilled, handleResourceDeleted('crop'))
      .addCase(deleteCrop.rejected, handleReject('crop'))
      // MachineType operations
      .addCase(loadMachineTypes.pending, handlePending('machineType'))
      .addCase(loadMachineTypes.fulfilled, handleResourceLoaded<TypeMachineTypeSchema>('machineType'))
      .addCase(loadMachineTypes.rejected, handleReject('machineType'))
      .addCase(addMachineType.pending, handlePending('machineType'))
      .addCase(addMachineType.fulfilled, handleResourceAdded<TypeMachineTypeSchema>('machineType'))
      .addCase(addMachineType.rejected, handleReject('machineType'))
      .addCase(modifyMachineType.pending, handlePending('machineType'))
      .addCase(modifyMachineType.fulfilled, handleResourceModified<TypeMachineTypeSchema>('machineType'))
      .addCase(modifyMachineType.rejected, handleReject('machineType'))
      .addCase(deleteMachineType.pending, handlePending('machineType'))
      .addCase(deleteMachineType.fulfilled, handleResourceDeleted('machineType'))
      .addCase(deleteMachineType.rejected, handleReject('machineType'))
      // Operator operations
      .addCase(loadOperators.pending, handlePending('operator'))
      .addCase(loadOperators.fulfilled, handleResourceLoaded<TypeOperatorSchema>('operator'))
      .addCase(loadOperators.rejected, handleReject('operator'))
      .addCase(addOperator.pending, handlePending('operator'))
      .addCase(addOperator.fulfilled, handleResourceAdded<TypeOperatorSchema>('operator'))
      .addCase(addOperator.rejected, handleReject('operator'))
      .addCase(modifyOperator.pending, handlePending('operator'))
      .addCase(modifyOperator.fulfilled, handleResourceModified<TypeOperatorSchema>('operator'))
      .addCase(modifyOperator.rejected, handleReject('operator'))
      .addCase(deleteOperator.pending, handlePending('operator'))
      .addCase(deleteOperator.fulfilled, handleResourceDeleted('operator'))
      .addCase(deleteOperator.rejected, handleReject('operator'))
      // Machine operations
      .addCase(loadMachines.pending, handlePending('machine'))
      .addCase(loadMachines.fulfilled, handleResourceLoaded<TypeMachineStateSchema>('machine'))
      .addCase(loadMachines.rejected, handleReject('machine'))
      .addCase(addMachine.pending, handlePending('machine'))
      .addCase(addMachine.fulfilled, handleResourceAdded<TypeMachineStateSchema>('machine'))
      .addCase(addMachine.rejected, handleReject('machine'))
      .addCase(modifyMachine.pending, handlePending('machine'))
      .addCase(modifyMachine.fulfilled, handleResourceModified<TypeMachineStateSchema>('machine'))
      .addCase(modifyMachine.rejected, handleReject('machine'))
      .addCase(deleteMachine.pending, handlePending('machine'))
      .addCase(deleteMachine.fulfilled, handleResourceDeleted('machine'))
      .addCase(deleteMachine.rejected, handleReject('machine'));
  },
});

export default resourcesSlice.reducer;
