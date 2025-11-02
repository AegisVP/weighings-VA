import type { TypeApiError } from '../types';
import type { TypeAppDispatch, TypeRootReduxState } from '../store';

export type TypeResourcesApiResponse<T> = {
  items: T[];
  count: number;
};

export type TypeThunkApiConfig = {
  state: TypeRootReduxState;
  dispatch: TypeAppDispatch;
  rejectValue: TypeApiError;
};

export type TypeAddPayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type TypeModifyPayload<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> & { id: string };
export type TypeDeletePayload = { id: string };
