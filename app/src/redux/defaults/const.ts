import type { TypeApiError } from '../types';

export type TypeDefaultLoadingTypes = {
  isLoading: boolean;
  error: TypeApiError;
};

export const defaultLoadingTypes: TypeDefaultLoadingTypes = {
  isLoading: false,
  error: null,
};
