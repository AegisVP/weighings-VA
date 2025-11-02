import { createSelector } from '@reduxjs/toolkit';
import type { TypeRootReduxState } from '../store';

export const selectLocation = (store: TypeRootReduxState) => store.resources.location;

export const selectCrop = (store: TypeRootReduxState) => store.resources.crop;

export const selectOperator = (store: TypeRootReduxState) => store.resources.operator;

export const selectMachineType = (store: TypeRootReduxState) => store.resources.machineType;

export const selectMachine = (store: TypeRootReduxState) => store.resources.machine;

export const selectMachineWithTypeName = createSelector([selectMachine, selectMachineType], (machine, machineType) => {
  const typeMap = new Map(machineType.items?.map((mt) => [mt.id, mt.name]));

  return {
    ...machine,
    items: machine.items?.map((m) => ({
      ...m,
      type: typeMap.get(m.type)!,
    })),
  };
});
