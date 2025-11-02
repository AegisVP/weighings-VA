import { MenuItem, Select } from '@mui/material';
import {
  selectCrop,
  selectLocation,
  selectMachine,
  selectMachineType,
  selectOperator,
} from '../redux/resources/resourcesSelectors';
import {
  addMachineType,
  deleteMachineType,
  loadMachineType,
  modifyMachineType,
} from '../redux/resources/resourcesOperations/machineTypeOperations';
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

import type { ColumnDef, RendererProps } from '../components/ResourceList/ResourceList';
import type { ResourceStore } from '../redux/resources/resourcesSlice';
import type {
  TypeCropSchema,
  TypeLocationSchema,
  TypeMachineTypeSchema,
  TypeMachineSchema,
  TypeOperatorSchema,
} from '../redux/types';

export type AddResourcePayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type ModifyResourcePayload<T> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type ResourceDefKey = 'machineType' | 'operator' | 'crop' | 'location' | 'machine';
export type ResourceDef<T> = {
  key: ResourceDefKey;
  label: string;
  cardSize: number | Record<string, number>;
  schemaType: T;
  columns: ColumnDef<T>[];
  selector: (state: TypeRootReduxState) => ResourceStore<T>;
  actions: {
    add: (item: AddResourcePayload<T>) => void;
    modify: (item: ModifyResourcePayload<T>) => void;
    remove: (id: string) => void;
    load: () => void;
  };
  getColumnOptions?: (state: TypeRootReduxState, columnId: keyof T) => { value: string; label: string }[] | undefined;
};

export type TypeAllResourceDefs =
  | ResourceDef<TypeMachineTypeSchema>
  | ResourceDef<TypeOperatorSchema>
  | ResourceDef<TypeCropSchema>
  | ResourceDef<TypeLocationSchema>
  | ResourceDef<TypeMachineSchema>;

const createResourceConfig = <T,>(options: ResourceDef<T>): ResourceDef<T> => ({
  ...options,
  schemaType: null as unknown as T, // save the type information only
});

const cardSize = { xs: 12, md: 6, lg: 4 };

// Helper function to prepare machine data for API calls
const prepareMachineData = (item: Partial<TypeMachineSchema> & { id?: string }) => ({
  ...item,
  type: item.type || '',
});

const machineTypeSelectRenderer = ({ row, isEditing, onChange, value }: RendererProps<TypeMachineSchema>) => {
  const machineTypes = store.getState().resources.machineType.items;
  const machineTypesMap = new Map(machineTypes.map((mt) => [mt.id, mt.name]));

  return isEditing ? (
    <Select label={'Тип'} fullWidth size="small" value={value} onChange={onChange}>
      {machineTypes.map(({ id, name }) => (
        <MenuItem key={id} value={id}>
          {name}
        </MenuItem>
      ))}
    </Select>
  ) : (
    machineTypesMap.get(row.type)
  );
};

export const getResourceConfigs = async (): Promise<TypeAllResourceDefs[]> => {
  await waitForRehydration(persistor);
  if (
    store.getState().resources.machineType.count === undefined &&
    store.getState().resources.machineType.isLoading === false
  ) {
    await store.dispatch(loadMachineType());
  }
  const machineTypes = store.getState().resources.machineType.items;
  // const machineTypesMap = new Map(machineTypes.map((mt) => [mt.id, mt.name]));
  const dispatch = store.dispatch as TypeAppDispatch;

  const RESOURCE_CONFIGS = [
    createResourceConfig<TypeMachineTypeSchema>({
      key: 'machineType',
      label: 'Тип машини',
      cardSize,
      schemaType: null as unknown as TypeMachineTypeSchema,
      columns: [{ id: 'name', label: 'Назва' }],
      selector: selectMachineType,
      actions: {
        add: (item: AddResourcePayload<TypeMachineTypeSchema>) => dispatch(addMachineType(item)),
        modify: (item: ModifyResourcePayload<TypeMachineTypeSchema>) => dispatch(modifyMachineType(item)),
        remove: (id) => dispatch(deleteMachineType({ id })),
        load: () => dispatch(loadMachineType()),
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
        add: (item: AddResourcePayload<TypeOperatorSchema>) => dispatch(addOperator(item)),
        modify: (item: ModifyResourcePayload<TypeOperatorSchema>) => dispatch(modifyOperator(item)),
        remove: (id) => dispatch(deleteOperator({ id })),
        load: () => dispatch(loadOperator()),
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
        add: (item: AddResourcePayload<TypeCropSchema>) => dispatch(addCrop(item)),
        modify: (item: ModifyResourcePayload<TypeCropSchema>) => dispatch(modifyCrop(item)),
        remove: (id) => dispatch(deleteCrop({ id })),
        load: () => dispatch(loadCrop()),
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
        add: (item: AddResourcePayload<TypeLocationSchema>) => dispatch(addLocation(item)),
        modify: (item: ModifyResourcePayload<TypeLocationSchema>) => dispatch(modifyLocation(item)),
        remove: (id) => dispatch(deleteLocation({ id })),
        load: () => dispatch(loadLocation()),
      },
    }),
    createResourceConfig<TypeMachineSchema>({
      key: 'machine',
      label: 'Машина',
      cardSize: { ...cardSize, lg: 6 },
      schemaType: null as unknown as TypeMachineSchema,
      columns: [
        { id: 'licensePlate', label: 'Номер' },
        { id: 'description', label: 'Опис' },
        { id: 'make', label: 'Марка' },
        { id: 'model', label: 'Модель' },
        {
          id: 'type',
          label: 'Тип',
          type: 'singleSelect',
          renderer: machineTypeSelectRenderer,
          valueOptions: machineTypes.map(({ id, name }) => ({ value: id, label: name })),
        },
      ],
      selector: selectMachine,
      actions: {
        add: (item: AddResourcePayload<TypeMachineSchema>) => {
          const machineData = prepareMachineData(item as Partial<TypeMachineSchema>);
          dispatch(addMachine(machineData as Parameters<typeof addMachine>[0]));
        },
        modify: (item: ModifyResourcePayload<TypeMachineSchema>) => {
          const machineData = prepareMachineData(item as Partial<TypeMachineSchema> & { id: string });
          dispatch(modifyMachine(machineData as Parameters<typeof modifyMachine>[0]));
        },
        remove: (id) => dispatch(deleteMachine({ id })),
        load: () => {
          dispatch(loadMachine());
          dispatch(loadMachineType());
        },
      },
      getColumnOptions: (state, columnId) => {
        if (columnId === 'type') {
          return state.resources.machineType.items.map((mt) => ({ value: mt.id, label: mt.name }));
        }
        return undefined;
      },
    }),
  ];
  return RESOURCE_CONFIGS;
};
