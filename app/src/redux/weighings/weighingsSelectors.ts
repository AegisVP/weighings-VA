import type { TypeRootReduxState } from '../store';

export const selectWeighings = (store: TypeRootReduxState) => store.weighings.items;

export const selectWeighingsLoading = (store: TypeRootReduxState) => store.weighings.isLoading;

export const selectWeighingsError = (store: TypeRootReduxState) => store.weighings.error;
