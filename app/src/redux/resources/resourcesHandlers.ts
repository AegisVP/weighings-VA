import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import type { TypeResourcesReduxState } from './resourcesSlice';
import type { TypeApiError } from '../types';

type TypeResourcePayloadAction<T> = PayloadAction<{ count: number; items: T[] }>;
type TypeResourceCaseReducer<T> = CaseReducer<TypeResourcesReduxState, TypeResourcePayloadAction<T>>;

export const handleResourceLoaded =
  <T>(resourceName: string): TypeResourceCaseReducer<T> =>
  (state, { payload }) => ({ ...state, [resourceName]: { isLoading: false, error: null, ...payload } });

// ########### DEFAULT HANDLERS #################
export const handlePending =
  (resourceName: string): CaseReducer<TypeResourcesReduxState> =>
  (state) => ({ ...state, [resourceName]: { isLoading: true, error: undefined } });

export const handleReject =
  (resourceName: string): CaseReducer<TypeResourcesReduxState, PayloadAction<TypeApiError>> =>
  (state, { payload }) => ({ ...state, [resourceName]: { isLoading: false, error: payload } });
