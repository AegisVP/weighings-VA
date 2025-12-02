import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import type { TypeApiError, TypeWeighingSchema } from '../types';
import type { TypeWeighingReduxState } from './weighingsSlice';
import type { TypeAddPayload } from '../resources/resourcesOperations';

type HandleRejectedDef = CaseReducer<TypeWeighingReduxState, PayloadAction<TypeApiError>>;

export const handleAddWeighing: CaseReducer<
  TypeWeighingReduxState,
  PayloadAction<TypeAddPayload<TypeWeighingSchema>>
> = (state, { payload }) => ({
  ...state,
  history: [...state.history, payload],
});

export const handleSearchWeighing: CaseReducer<TypeWeighingReduxState, PayloadAction<TypeWeighingSchema[]>> = (
  state,
  { payload }
) => ({
  ...state,
  history: payload,
});

export const handlePending: CaseReducer<TypeWeighingReduxState> = (state) => ({
  ...state,
  isLoading: true,
  error: undefined,
});

export const handleFulfill: CaseReducer<TypeWeighingReduxState> = (state) => ({
  ...state,
  isLoading: false,
  error: undefined,
});

export const handleReject: HandleRejectedDef = (state, { payload }) => ({ ...state, isLoading: false, error: payload });
