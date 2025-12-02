import type { TypeRootReduxState } from '../store';

export const selectWeighings = (store: TypeRootReduxState) => store.weighings.history;

export const selectWeighingsInProgress = (store: TypeRootReduxState) => store.weighings.inProgress;

export const selectWeighingsLoading = (store: TypeRootReduxState) => store.weighings.isLoading;

export const selectWeighingsError = (store: TypeRootReduxState) => store.weighings.error;
