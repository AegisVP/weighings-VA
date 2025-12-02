import { createSlice, type Draft } from '@reduxjs/toolkit';

import { addWeighing, searchWeighing } from './weighingsOperations';
import {
  handleAddWeighing,
  handlePending,
  handleFulfill,
  handleReject,
  handleSearchWeighing,
} from './weighingsHandlers';

import type { TypeWeighingSchema } from '../types';

export type TypeWeighingReduxState = {
  isLoading: boolean;
  error?: string;
  history: TypeWeighingSchema[];
  inProgress: Draft<TypeWeighingSchema>[];
};

export const initialState: TypeWeighingReduxState = {
  isLoading: false,
  error: undefined,
  history: [],
  inProgress: [],
};

const weighingsSlice = createSlice({
  name: 'weighings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWeighing.fulfilled, handleAddWeighing)
      .addCase(searchWeighing.fulfilled, handleSearchWeighing)
      .addMatcher(({ type }) => type.startsWith('weighings/') && type.endsWith('/pending'), handlePending)
      .addMatcher(({ type }) => type.startsWith('weighings/') && type.endsWith('/fulfilled'), handleFulfill)
      .addMatcher(({ type }) => type.startsWith('weighings/') && type.endsWith('/rejected'), handleReject);
  },
});

export default weighingsSlice.reducer;
