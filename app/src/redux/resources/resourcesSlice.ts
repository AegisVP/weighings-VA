import { createSlice } from '@reduxjs/toolkit';
import type { TypeDefaultLoadingTypes } from '../defaults/const';
import type { TypeCropSchema, TypeLocationSchema, TypeMachineSchema, TypeOperatorSchema } from '../types';
import {
  buildMatcherHandlers,
  handleResourceAdded,
  handleResourceDeleted,
  handleResourceLoaded,
  handleResourceModified,
} from './resourcesHandlers';
import { addCrop, deleteCrop, loadCrop, modifyCrop } from './resourcesOperations/cropOperations';
import { addLocation, deleteLocation, loadLocation, modifyLocation } from './resourcesOperations/locationOperations';
import { addOperator, deleteOperator, loadOperator, modifyOperator } from './resourcesOperations/operatorOperations';
import { addMachine, deleteMachine, loadMachine, modifyMachine } from './resourcesOperations/machineOperations';

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
  crops: ResourceStore<TypeCropSchema>;
  operators: ResourceStore<TypeOperatorSchema>;
  machines: ResourceStore<TypeMachineSchema>;
  locations: ResourceStore<TypeLocationSchema>;
};

const initialState: TypeResourcesReduxState = {
  crops: resState<TypeCropSchema>(),
  operators: resState<TypeOperatorSchema>(),
  machines: resState<TypeMachineSchema>(),
  locations: resState<TypeLocationSchema>(),
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Location operations
      .addCase(loadLocation.fulfilled, handleResourceLoaded<TypeLocationSchema>('locations'))
      .addCase(addLocation.fulfilled, handleResourceAdded<TypeLocationSchema>('locations'))
      .addCase(modifyLocation.fulfilled, handleResourceModified<TypeLocationSchema>('locations'))
      .addCase(deleteLocation.fulfilled, handleResourceDeleted('locations'))
      // Crop operations
      .addCase(loadCrop.fulfilled, handleResourceLoaded<TypeCropSchema>('crops'))
      .addCase(addCrop.fulfilled, handleResourceAdded<TypeCropSchema>('crops'))
      .addCase(modifyCrop.fulfilled, handleResourceModified<TypeCropSchema>('crops'))
      .addCase(deleteCrop.fulfilled, handleResourceDeleted('crops'))
      // Operator operations
      .addCase(loadOperator.fulfilled, handleResourceLoaded<TypeOperatorSchema>('operators'))
      .addCase(addOperator.fulfilled, handleResourceAdded<TypeOperatorSchema>('operators'))
      .addCase(modifyOperator.fulfilled, handleResourceModified<TypeOperatorSchema>('operators'))
      .addCase(deleteOperator.fulfilled, handleResourceDeleted('operators'))
      // Machine operations
      .addCase(loadMachine.fulfilled, handleResourceLoaded<TypeMachineSchema>('machines'))
      .addCase(addMachine.fulfilled, handleResourceAdded<TypeMachineSchema>('machines'))
      .addCase(modifyMachine.fulfilled, handleResourceModified<TypeMachineSchema>('machines'))
      .addCase(deleteMachine.fulfilled, handleResourceDeleted('machines'))
      // General matchers
      .addMatcher(...buildMatcherHandlers('crops', 'pending'))
      .addMatcher(...buildMatcherHandlers('crops', 'fulfilled'))
      .addMatcher(...buildMatcherHandlers('crops', 'rejected'))
      .addMatcher(...buildMatcherHandlers('locations', 'pending'))
      .addMatcher(...buildMatcherHandlers('locations', 'fulfilled'))
      .addMatcher(...buildMatcherHandlers('locations', 'rejected'))
      .addMatcher(...buildMatcherHandlers('operators', 'pending'))
      .addMatcher(...buildMatcherHandlers('operators', 'fulfilled'))
      .addMatcher(...buildMatcherHandlers('operators', 'rejected'))
      .addMatcher(...buildMatcherHandlers('machines', 'pending'))
      .addMatcher(...buildMatcherHandlers('machines', 'fulfilled'))
      .addMatcher(...buildMatcherHandlers('machines', 'rejected'));
  },
});

export default resourcesSlice.reducer;
