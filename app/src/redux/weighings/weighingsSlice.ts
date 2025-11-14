import { createSlice } from '@reduxjs/toolkit';

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
  items: TypeWeighingSchema[];
};

export const initialState: TypeWeighingReduxState = {
  isLoading: false,
  error: undefined,
  items: [],
};

const weighingsSlice = createSlice({
  name: 'weighings',
  initialState,
  reducers: {
    // addWeighing: (state, { payload }) => [...state, { ...payload, dateTime: new Date(payload.dateTime) }],
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWeighing.fulfilled, handleAddWeighing)
      .addCase(searchWeighing.fulfilled, handleSearchWeighing)
      .addMatcher((action) => action.type.endsWith('/pending'), handlePending)
      .addMatcher((action) => action.type.endsWith('/fulfilled'), handleFulfill)
      .addMatcher((action) => action.type.endsWith('/rejected'), handleReject);
  },
});

// export const { addWeighing } = weighingsSlice.actions;

export default weighingsSlice.reducer;
