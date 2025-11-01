import {
  loadCrops,
  loadLocations,
  loadMachines,
  loadMachineTypes,
  loadOperators,
  addCrop,
  modifyCrop,
  deleteCrop,
  addLocation,
  modifyLocation,
  deleteLocation,
  addMachine,
  modifyMachine,
  deleteMachine,
  addMachineType,
  modifyMachineType,
  deleteMachineType,
  addOperator,
  modifyOperator,
  deleteOperator,
} from '../redux/resources/resourcesOperations';
import {
  selectCrop,
  selectLocation,
  selectMachineType,
  selectMachineWithTypeName,
  selectOperator,
} from '../redux/resources/resourcesSelectors';

import type { ColumnDef } from '../components/ResourceList/ResourceList';
import type { TypeMachineStateSchema } from '../redux/resources/resourcesSlice';
import type { TypeAppDispatch, TypeRootReduxState } from '../redux/store';
import type {
  TypeApiError,
  TypeCropSchema,
  TypeLocationSchema,
  TypeMachineTypeSchema,
  TypeOperatorSchema,
} from '../redux/types';

export type ResourceDef<T> = {
  key: string;
  label: string;
  cardSize: number | Record<string, number>;
  schemaType: T;
  columns: ColumnDef<T>[];
  selector: (state: TypeRootReduxState) => {
    items: T[];
    isLoading: boolean;
    error: TypeApiError;
    count?: number;
  };
  actions: {
    add: (dispatch: TypeAppDispatch) => (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
    modify: (dispatch: TypeAppDispatch) => (item: Partial<T> & { id: string }) => void;
    remove: (dispatch: TypeAppDispatch) => (id: string) => void;
    load: (dispatch: TypeAppDispatch) => () => void;
  };
};

const createResourceConfig = <T>(options: ResourceDef<T>): ResourceDef<T> => ({
  ...options,
  schemaType: null as unknown as T, // save the type information only
});

const cardSize = { xs: 12, md: 6, lg: 4 };
export const RESOURCE_CONFIGS = [
  createResourceConfig<TypeMachineTypeSchema>({
    key: 'machineType',
    label: 'Тип машини',
    cardSize,
    schemaType: null as unknown as TypeMachineTypeSchema,
    columns: [{ id: 'name', label: 'Назва' }],
    selector: selectMachineType,
    actions: {
      add: (dispatch) => (item) => dispatch(addMachineType(item)),
      modify: (dispatch) => (item) => dispatch(modifyMachineType(item)),
      remove: (dispatch) => (id) => dispatch(deleteMachineType({ id })),
      load: (dispatch) => () => dispatch(loadMachineTypes()),
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
      add: (dispatch) => (item) => dispatch(addOperator(item)),
      modify: (dispatch) => (item) => dispatch(modifyOperator(item)),
      remove: (dispatch) => (id) => dispatch(deleteOperator({ id })),
      load: (dispatch) => () => dispatch(loadOperators()),
    },
  }),
  createResourceConfig<TypeCropSchema>({
    key: 'crops',
    label: 'Культура',
    cardSize,
    schemaType: null as unknown as TypeCropSchema,
    columns: [{ id: 'name', label: 'Назва' }],
    selector: selectCrop,
    actions: {
      add: (dispatch) => (item) => dispatch(addCrop(item)),
      modify: (dispatch) => (item) => dispatch(modifyCrop(item)),
      remove: (dispatch) => (id) => dispatch(deleteCrop({ id })),
      load: (dispatch) => () => dispatch(loadCrops()),
    },
  }),
  createResourceConfig<TypeLocationSchema>({
    key: 'location',
    label: 'Локація',
    cardSize: { ...cardSize, lg: 6 },
    schemaType: null as unknown as TypeLocationSchema,
    columns: [
      { id: 'name', label: 'Назва', width: 60 },
      { id: 'isSource', label: 'Джерело', width: 20 },
      { id: 'isDestination', label: 'Призначення', width: 20 },
    ],
    selector: selectLocation,
    actions: {
      add: (dispatch) => (item) => dispatch(addLocation(item)),
      modify: (dispatch) => (item) => dispatch(modifyLocation(item)),
      remove: (dispatch) => (id) => dispatch(deleteLocation({ id })),
      load: (dispatch) => () => dispatch(loadLocations()),
    },
  }),
  createResourceConfig<TypeMachineStateSchema>({
    key: 'machines',
    label: 'Машини',
    cardSize: { ...cardSize, lg: 6 },
    schemaType: null as unknown as TypeMachineStateSchema,
    columns: [
      { id: 'licensePlate', label: 'Номер' },
      { id: 'description', label: 'Опис' },
      { id: 'make', label: 'Марка' },
      { id: 'model', label: 'Модель' },
      { id: 'type', label: 'Тип' },
    ],
    selector: selectMachineWithTypeName,
    actions: {
      add: (dispatch) => (item) => dispatch(addMachine(item as any)),
      modify: (dispatch) => (item) => dispatch(modifyMachine(item as any)),
      remove: (dispatch) => (id) => dispatch(deleteMachine({ id })),
      load: (dispatch) => () => {
        dispatch(loadMachines());
        dispatch(loadMachineTypes());
      },
    },
  }),
];
