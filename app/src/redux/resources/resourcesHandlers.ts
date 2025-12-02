import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import type { TypeResourcesReduxState } from './resourcesSlice';
import type { TypeApiError } from '../types';

type TypeResourceCaseReducer<T> = CaseReducer<TypeResourcesReduxState, PayloadAction<{ count: number; items: T[] }>>;

export const handleResourceLoaded =
  <T>(resourceName: Extract<keyof TypeResourcesReduxState, string>): TypeResourceCaseReducer<T> =>
  (state, { payload }) => ({ ...state, [resourceName]: { isLoading: false, error: undefined, ...payload } });

// ########### DEFAULT HANDLERS #################
export const handlePending =
  (resourceName: Extract<keyof TypeResourcesReduxState, string>): CaseReducer<TypeResourcesReduxState> =>
  (state) => ({ ...state, [resourceName]: { ...state[resourceName], isLoading: true, error: undefined } });

export const handleReject =
  (
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<TypeApiError>> =>
  (state, { payload }) => ({ ...state, [resourceName]: { ...state[resourceName], isLoading: false, error: payload } });

export const handleFulfill =
  (
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<TypeApiError>> =>
  (state) => ({ ...state, [resourceName]: { ...state[resourceName], isLoading: false, error: undefined } });

type TypeResource = keyof TypeResourcesReduxState;
type TypeActionType = 'pending' | 'rejected' | 'fulfilled';
const getHandler = (actionType: TypeActionType) => {
  switch (actionType) {
    case 'pending':
      return handlePending;
    case 'rejected':
      return handleReject;
    case 'fulfilled':
      return handleFulfill;
  }
};

export const buildMatcherHandlers = (resource: TypeResource, actionType: TypeActionType) => {
  const handler = getHandler(actionType);
  return [
    ({ type }: { type: string }) => type.startsWith(`${resource}`) && type.endsWith(`/${actionType}`),
    handler(resource),
  ] as const;
};

// ########### CRUD HANDLERS #################
export const handleResourceAdded =
  <T extends { id: string }>(
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<T>> =>
  (state, { payload }) => {
    const resource = state[resourceName];
    return {
      ...state,
      [resourceName]: {
        ...resource,
        items: [...resource.items, payload],
        count: (resource.count ?? 0) + 1,
      },
    };
  };

export const handleResourceModified =
  <T extends { id: string }>(
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<T>> =>
  (state, { payload }) => {
    const resource = state[resourceName];
    return {
      ...state,
      [resourceName]: {
        ...resource,
        items: resource.items.map((item) => (item.id === payload.id ? payload : item)),
      },
    };
  };

export const handleResourceDeleted =
  (
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<{ id: string }>> =>
  (state, { payload }) => {
    const resource = state[resourceName];
    return {
      ...state,
      [resourceName]: {
        ...resource,
        items: resource.items.filter((item: { id: string }) => item.id !== payload.id),
        count: Math.max(0, (resource.count ?? 0) - 1),
      },
    };
  };
