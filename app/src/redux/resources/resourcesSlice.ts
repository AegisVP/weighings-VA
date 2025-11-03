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
  buildMatcherFulfilledHandler,
  buildMatcherPendingHandler,
  buildMatcherRejectedHandler,
  handleResourceAdded,
  handleResourceDeleted,
  handleResourceLoaded,
  handleResourceModified,
} from './resourcesHandlers';
import { addCrop, deleteCrop, loadCrop, modifyCrop } from './resourcesOperations/cropOperations';
import { addLocation, deleteLocation, loadLocation, modifyLocation } from './resourcesOperations/locationOperations';
import { addOperator, deleteOperator, loadOperator, modifyOperator } from './resourcesOperations/operatorOperations';
import { addMachine, deleteMachine, loadMachine, modifyMachine } from './resourcesOperations/machineOperations';
import {
  addMachineType,
  deleteMachineType,
  loadMachineType,
  modifyMachineType,
} from './resourcesOperations/machineTypeOperations';

export type ResourceStore<T> = TypeDefaultLoadingTypes & {
  items: T[];
  count?: number;
};

const resState = <T>(): ResourceStore<T> => ({
  isLoading: false,
  error: undefined,
  items: [],
  count: undefined,
});

export type TypeResourcesReduxState = {
  crop: ResourceStore<TypeCropSchema>;
  operator: ResourceStore<TypeOperatorSchema>;
  machineType: ResourceStore<TypeMachineTypeSchema>;
  machine: ResourceStore<TypeMachineSchema>;
  location: ResourceStore<TypeLocationSchema>;
};

const initialState: TypeResourcesReduxState = {
  crop: resState<TypeCropSchema>(),
  operator: resState<TypeOperatorSchema>(),
  machineType: resState<TypeMachineTypeSchema>(),
  machine: resState<TypeMachineSchema>(),
  location: resState<TypeLocationSchema>(),
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Location operations
      .addCase(loadLocation.fulfilled, handleResourceLoaded<TypeLocationSchema>('location'))
      .addCase(addLocation.fulfilled, handleResourceAdded<TypeLocationSchema>('location'))
      .addCase(modifyLocation.fulfilled, handleResourceModified<TypeLocationSchema>('location'))
      .addCase(deleteLocation.fulfilled, handleResourceDeleted('location'))
      // Crop operations
      .addCase(loadCrop.fulfilled, handleResourceLoaded<TypeCropSchema>('crop'))
      .addCase(addCrop.fulfilled, handleResourceAdded<TypeCropSchema>('crop'))
      .addCase(modifyCrop.fulfilled, handleResourceModified<TypeCropSchema>('crop'))
      .addCase(deleteCrop.fulfilled, handleResourceDeleted('crop'))
      // MachineType operations
      .addCase(loadMachineType.fulfilled, handleResourceLoaded<TypeMachineTypeSchema>('machineType'))
      .addCase(addMachineType.fulfilled, handleResourceAdded<TypeMachineTypeSchema>('machineType'))
      .addCase(modifyMachineType.fulfilled, handleResourceModified<TypeMachineTypeSchema>('machineType'))
      .addCase(deleteMachineType.fulfilled, handleResourceDeleted('machineType'))
      // Operator operations
      .addCase(loadOperator.fulfilled, handleResourceLoaded<TypeOperatorSchema>('operator'))
      .addCase(addOperator.fulfilled, handleResourceAdded<TypeOperatorSchema>('operator'))
      .addCase(modifyOperator.fulfilled, handleResourceModified<TypeOperatorSchema>('operator'))
      .addCase(deleteOperator.fulfilled, handleResourceDeleted('operator'))
      // Machine operations
      .addCase(loadMachine.fulfilled, handleResourceLoaded<TypeMachineSchema>('machine'))
      .addCase(addMachine.fulfilled, handleResourceAdded<TypeMachineSchema>('machine'))
      .addCase(modifyMachine.fulfilled, handleResourceModified<TypeMachineSchema>('machine'))
      .addCase(deleteMachine.fulfilled, handleResourceDeleted('machine'))
      // General matchers
      .addMatcher(...buildMatcherPendingHandler('crop'))
      .addMatcher(...buildMatcherFulfilledHandler('crop'))
      .addMatcher(...buildMatcherRejectedHandler('crop'))
      .addMatcher(...buildMatcherPendingHandler('location'))
      .addMatcher(...buildMatcherFulfilledHandler('location'))
      .addMatcher(...buildMatcherRejectedHandler('location'))
      .addMatcher(...buildMatcherPendingHandler('operator'))
      .addMatcher(...buildMatcherFulfilledHandler('operator'))
      .addMatcher(...buildMatcherRejectedHandler('operator'))
      .addMatcher(...buildMatcherPendingHandler('machineType'))
      .addMatcher(...buildMatcherFulfilledHandler('machineType'))
      .addMatcher(...buildMatcherRejectedHandler('machineType'))
      .addMatcher(...buildMatcherPendingHandler('machine'))
      .addMatcher(...buildMatcherFulfilledHandler('machine'))
      .addMatcher(...buildMatcherRejectedHandler('machine'));
  },
});

export default resourcesSlice.reducer;
