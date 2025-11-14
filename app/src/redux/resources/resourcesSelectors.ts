import type { TypeRootReduxState } from '../store';

export const selectLocation = (store: TypeRootReduxState) => store.resources.location;

export const selectCrop = (store: TypeRootReduxState) => store.resources.crop;

export const selectOperator = (store: TypeRootReduxState) => store.resources.operator;

export const selectMachine = (store: TypeRootReduxState) => store.resources.machine;
