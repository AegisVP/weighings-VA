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

// ########### CRUD HANDLERS #################
export const handleResourceAdded =
  <T extends { id: string }>(resourceName: string): CaseReducer<TypeResourcesReduxState, PayloadAction<T>> =>
  (state, { payload }) => {
    const resource = state[resourceName as keyof TypeResourcesReduxState];
    return {
      ...state,
      [resourceName]: {
        ...resource,
        isLoading: false,
        error: null,
        items: [...resource.items, payload],
        count: (resource.count ?? 0) + 1,
      },
    };
  };

export const handleResourceModified =
  <T extends { id: string }>(resourceName: string): CaseReducer<TypeResourcesReduxState, PayloadAction<T>> =>
  (state, { payload }) => {
    const resource = state[resourceName as keyof TypeResourcesReduxState];
    return {
      ...state,
      [resourceName]: {
        ...resource,
        isLoading: false,
        error: null,
        items: resource.items.map((item: T) => (item.id === payload.id ? payload : item)),
      },
    };
  };

export const handleResourceDeleted =
  (resourceName: string): CaseReducer<TypeResourcesReduxState, PayloadAction<{ id: string }>> =>
  (state, { payload }) => {
    const resource = state[resourceName as keyof TypeResourcesReduxState];
    return {
      ...state,
      [resourceName]: {
        ...resource,
        isLoading: false,
        error: null,
        items: resource.items.filter((item: { id: string }) => item.id !== payload.id),
        count: Math.max(0, (resource.count ?? 0) - 1),
      },
    };
  };
