import type { TypeRootReduxState } from '../store';

export const selectLocation = (store: TypeRootReduxState) => store.resources.locations;
export const selectLocations =
  (withDeleted: boolean = false) =>
  (store: TypeRootReduxState) => {
    const { items } = selectLocation(store);
    return withDeleted ? items : items.filter((i) => i.deletedAt === null);
  };

export const selectCrop = (store: TypeRootReduxState) => store.resources.crops;
export const selectCrops =
  (withDeleted: boolean = false) =>
  (store: TypeRootReduxState) => {
    const { items } = selectCrop(store);
    console.log({ crops: items, withDeleted });
    return withDeleted ? items : items.filter((i) => i.deletedAt === null);
  };

export const selectOperator = (store: TypeRootReduxState) => store.resources.operators;
export const selectOperators =
  (withDeleted: boolean = false) =>
  (store: TypeRootReduxState) => {
    const { items } = selectOperator(store);
    return withDeleted ? items : items.filter((i) => i.deletedAt === null);
  };

export const selectMachine = (store: TypeRootReduxState) => store.resources.machines;
export const selectMachines =
  (withDeleted: boolean = false) =>
  (store: TypeRootReduxState) => {
    const { items } = selectMachine(store);
    return withDeleted ? items : items.filter((i) => i.deletedAt === null);
  };
