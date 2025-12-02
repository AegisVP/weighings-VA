import { createSlice } from '@reduxjs/toolkit';

import { addWeighing, defaultValues, searchWeighing } from './weighingsOperations';
import {
  handleAddWeighing,
  handlePending,
  handleFulfill,
  handleReject,
  handleSearchWeighing,
} from './weighingsHandlers';

import type { TypeWeighingSchema } from '../types';
import type { TypeWeighingInput } from '../../components/WeighingEntryForm/WeighingEntryForm';

export type TypeWeighingReduxState = {
  isLoading: boolean;
  error?: string;
  history: TypeWeighingSchema[];
  inProgress: TypeWeighingInput[];
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
  reducers: {
    newWeighingInProgress: (state: TypeWeighingReduxState, action: { payload: string }) => {
      return { ...state, inProgress: [...state.inProgress, { ...defaultValues, dateTime: action.payload }] };
    },
    removeWeighingInProgress: (state: TypeWeighingReduxState, action) => ({
      ...state,
      inProgress: state.inProgress.filter((wip) => wip.dateTime !== action.payload),
    }),
    editWeighingInProgress: (state: TypeWeighingReduxState, action: { payload: TypeWeighingInput }) => {
      const index = state.inProgress.findIndex((wip) => wip.dateTime === action.payload.dateTime);
      if (index !== -1) {
        const updatedInProgress = [...state.inProgress];
        updatedInProgress[index] = action.payload;
        return { ...state, inProgress: updatedInProgress };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWeighing.fulfilled, handleAddWeighing)
      .addCase(searchWeighing.fulfilled, handleSearchWeighing)
      .addMatcher(({ type }) => type.startsWith('weighings/') && type.endsWith('/pending'), handlePending)
      .addMatcher(({ type }) => type.startsWith('weighings/') && type.endsWith('/fulfilled'), handleFulfill)
      .addMatcher(({ type }) => type.startsWith('weighings/') && type.endsWith('/rejected'), handleReject);
  },
});

export const { newWeighingInProgress, editWeighingInProgress, removeWeighingInProgress } = weighingsSlice.actions;

export default weighingsSlice.reducer;
