import { selectCrop, selectLocation, selectMachine, selectOperator } from '../redux/resources/resourcesSelectors';
import {
  addOperator,
  deleteOperator,
  loadOperator,
  modifyOperator,
} from '../redux/resources/resourcesOperations/operatorOperations';
import {
  addLocation,
  deleteLocation,
  loadLocation,
  modifyLocation,
} from '../redux/resources/resourcesOperations/locationOperations';
import {
  addMachine,
  deleteMachine,
  loadMachine,
  modifyMachine,
} from '../redux/resources/resourcesOperations/machineOperations';
import { addCrop, deleteCrop, loadCrop, modifyCrop } from '../redux/resources/resourcesOperations/cropOperations';
import { persistor, store, waitForRehydration, type TypeAppDispatch, type TypeRootReduxState } from '../redux/store';

import type { ColumnDef } from '../components/ResourceList/ResourceList';
import type { ResourceStore } from '../redux/resources/resourcesSlice';
import type { TypeCropSchema, TypeLocationSchema, TypeMachineSchema, TypeOperatorSchema } from '../redux/types';

export type AddResourcePayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type ModifyResourcePayload<T> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type ResourceDefKey = 'operator' | 'crop' | 'location' | 'machine';
export type ResourceDef<T> = {
  key: ResourceDefKey;
  label: string;
  cardSize: number | Record<string, number>;
  schemaType: T;
  columns: ColumnDef<T>[];
  selector: (state: TypeRootReduxState) => ResourceStore<T>;
  actions: {
    add: (item: AddResourcePayload<T>) => Promise<void> | void;
    modify: (item: ModifyResourcePayload<T>) => Promise<void> | void;
    remove: (id: string) => Promise<void> | void;
    load: () => Promise<void> | void;
  };
  getColumnOptions?: (state: TypeRootReduxState, columnId: keyof T) => { value: string; label: string }[] | undefined;
};

export type TypeAllResourceDefs =
  | ResourceDef<TypeOperatorSchema>
  | ResourceDef<TypeCropSchema>
  | ResourceDef<TypeLocationSchema>
  | ResourceDef<TypeMachineSchema>;

const createResourceConfig = <T,>(options: ResourceDef<T>): ResourceDef<T> => ({
  ...options,
  schemaType: null as unknown as T, // save the type information only
});

const cardSize = { xs: 12, md: 6, lg: 4 };

export const getResourceConfigs = async (): Promise<TypeAllResourceDefs[]> => {
  await waitForRehydration(persistor);
  const dispatch = store.dispatch as TypeAppDispatch;

  const RESOURCE_CONFIGS = [
    createResourceConfig<TypeMachineSchema>({
      key: 'machine',
      label: 'Машина',
      cardSize: { ...cardSize, lg: 8 },
      schemaType: null as unknown as TypeMachineSchema,
      columns: [
        { id: 'licensePlate', label: 'Номер' },
        { id: 'description', label: 'Опис' },
        { id: 'make', label: 'Марка' },
        { id: 'model', label: 'Модель' },
        { id: 'canDeliver', label: 'Може доставляти', type: 'boolean', width: 20 },
        { id: 'canHarvest', label: 'Може збирати', type: 'boolean', width: 20 },
      ],
      selector: selectMachine,
      actions: {
        add: async (item: AddResourcePayload<TypeMachineSchema>) => {
          await dispatch(addMachine(item));
        },
        modify: async (item: ModifyResourcePayload<TypeMachineSchema>) => {
          await dispatch(modifyMachine(item));
        },
        remove: async (id) => {
          await dispatch(deleteMachine({ id }));
        },
        load: () => {
          dispatch(loadMachine());
        },
      },
    }),
    createResourceConfig<TypeOperatorSchema>({
      key: 'operator',
      label: 'Оператор',
      cardSize,
      schemaType: null as unknown as TypeOperatorSchema,
      columns: [{ id: 'name', label: 'Імʼя' }],
      selector: selectOperator,
      actions: {
        add: async (item: AddResourcePayload<TypeOperatorSchema>) => {
          await dispatch(addOperator(item));
        },
        modify: async (item: ModifyResourcePayload<TypeOperatorSchema>) => {
          await dispatch(modifyOperator(item));
        },
        remove: async (id) => {
          await dispatch(deleteOperator({ id }));
        },
        load: async () => {
          await dispatch(loadOperator());
        },
      },
    }),
    createResourceConfig<TypeLocationSchema>({
      key: 'location',
      label: 'Локація',
      cardSize: { ...cardSize, lg: 6 },
      schemaType: null as unknown as TypeLocationSchema,
      columns: [
        { id: 'name', label: 'Назва', width: 60 },
        { id: 'isSource', label: 'Джерело', width: 20, type: 'boolean' },
        { id: 'isDestination', label: 'Призначення', width: 20, type: 'boolean' },
      ],
      selector: selectLocation,
      actions: {
        add: async (item: AddResourcePayload<TypeLocationSchema>) => {
          await dispatch(addLocation(item));
        },
        modify: async (item: ModifyResourcePayload<TypeLocationSchema>) => {
          await dispatch(modifyLocation(item));
        },
        remove: async (id) => {
          await dispatch(deleteLocation({ id }));
        },
        load: async () => {
          await dispatch(loadLocation());
        },
      },
    }),
    createResourceConfig<TypeCropSchema>({
      key: 'crop',
      label: 'Культура',
      cardSize,
      schemaType: null as unknown as TypeCropSchema,
      columns: [{ id: 'name', label: 'Назва' }],
      selector: selectCrop,
      actions: {
        add: async (item: AddResourcePayload<TypeCropSchema>) => {
          await dispatch(addCrop(item));
        },
        modify: async (item: ModifyResourcePayload<TypeCropSchema>) => {
          await dispatch(modifyCrop(item));
        },
        remove: async (id) => {
          await dispatch(deleteCrop({ id }));
        },
        load: async () => {
          await dispatch(loadCrop());
        },
      },
    }),
  ];
  return RESOURCE_CONFIGS;
};
