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
  (state) => ({ ...state, [resourceName]: { isLoading: true, error: undefined } });

export const handleReject =
  (
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<TypeApiError>> =>
  (state, { payload }) => ({ ...state, [resourceName]: { isLoading: false, error: payload } });

export const handleFulfill =
  (
    resourceName: Extract<keyof TypeResourcesReduxState, string>
  ): CaseReducer<TypeResourcesReduxState, PayloadAction<TypeApiError>> =>
  (state) => ({ ...state, [resourceName]: { isLoading: false, error: undefined } });

const buildMatcherHandlers = (type: 'Pending' | 'Rejected' | 'Fulfilled', resource: string) => {
  const handler = type === 'Pending' ? handlePending : type === 'Rejected' ? handleReject : handleFulfill;
  const matcherString = `${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}/${type.toLowerCase()}`;
  return [
    ({ type }: { type: string }) => type.endsWith(matcherString),
    handler(resource as keyof TypeResourcesReduxState),
  ] as const;
};
export const buildMatcherPendingHandler = (resource: string) => buildMatcherHandlers('Pending', resource);
export const buildMatcherRejectedHandler = (resource: string) => buildMatcherHandlers('Rejected', resource);
export const buildMatcherFulfilledHandler = (resource: string) => buildMatcherHandlers('Fulfilled', resource);

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
