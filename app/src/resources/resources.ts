import {
  loadCrops,
  loadLocations,
  loadMachines,
  loadMachineTypes,
  loadOperators,
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
    // add: (dispatch: TypeAppDispatch) => (item: T) => void;
    // update: (dispatch: TypeAppDispatch) => (item: T) => void;
    // delete: (dispatch: TypeAppDispatch) => (id: string) => void;
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
      // add: (dispatch) => (item) => { dispatch(addCropSchema(item)); },
      // update
      // delete
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
      load: (dispatch) => () => {
        dispatch(loadMachines());
        dispatch(loadMachineTypes());
      },
    },
  }),
];
