import { createSlice } from '@reduxjs/toolkit';
import type { TypeWeighingSchema } from '../types';

export type TypeWeighingReduxState = TypeWeighingSchema[];

export const initialState: TypeWeighingReduxState = [];

const weighingsSlice = createSlice({
  name: 'weighings',
  initialState,
  reducers: {
    addWeighing: (state, action) => {
      console.log({ state, action });
    },
  },
  // extraReducers: (builder) => {builder.addCase()}
});

export const { addWeighing } = weighingsSlice.actions;

export default weighingsSlice.reducer;
