import { createSelector } from '@reduxjs/toolkit';
import type { TypeRootReduxState } from '../store';

export const selectLocation = (store: TypeRootReduxState) => store.resources.locations;
export const selectLocations = (withDeleted: boolean = false) =>
  createSelector([selectLocation], ({ items }) => (withDeleted ? items : items.filter((i) => i.deletedAt === null)));

export const selectCrop = (store: TypeRootReduxState) => store.resources.crops;
export const selectCrops = (withDeleted: boolean = false) =>
  createSelector([selectCrop], ({ items }) => (withDeleted ? items : items.filter((i) => i.deletedAt === null)));

export const selectOperator = (store: TypeRootReduxState) => store.resources.operators;
export const selectOperators = (withDeleted: boolean = false) =>
  createSelector([selectOperator], ({ items }) => (withDeleted ? items : items.filter((i) => i.deletedAt === null)));

export const selectMachine = (store: TypeRootReduxState) => store.resources.machines;
export const selectMachines = (withDeleted: boolean = false) =>
  createSelector([selectMachine], ({ items }) => (withDeleted ? items : items.filter((i) => i.deletedAt === null)));
