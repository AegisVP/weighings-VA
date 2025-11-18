import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';

import { useAppSelector } from '../../redux/hooks';
import { ResourceTable } from './ResourceTable';

import type { SelectChangeEvent } from '@mui/material/Select';
import type { ResourceDef } from '../../resources/resources';

export type TypeOnChangeDef = (
  e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string | number | boolean> | React.SyntheticEvent,
  child?: React.ReactNode
) => void;
export type RendererDef<T> = React.ComponentType<RendererProps<T>>;
export type BaseRenderer<T> = { renderer?: RendererDef<T> };
export type RendererProps<T> = {
  row: T;
  onChange: TypeOnChangeDef;
  value: string | number | boolean;
  isEditing: boolean;
};
export type ColumnDef<T> = {
  id: Extract<keyof T, string>;
  label: string;
  width?: number;
  renderer?: RendererDef<T>;
  type?: 'text' | 'boolean' | 'singleSelect';
  valueOptions?: { value: string; label: string }[];
};

type ResourceListProps<T extends { id: string }> = {
  config: ResourceDef<T>;
};
export const ResourceList = <T extends { id: string }>({ config }: ResourceListProps<T>) => {
  const { items, count, isLoading, error } = useAppSelector((state) => config.selector(state));

  useEffect(() => {
    if (isLoading) return;
    if (count !== undefined) return;
    if (error) return;

    config.actions.load();
  }, [config, isLoading, count, error]);

  return (
    <Grid key={config.key} size={config.cardSize}>
      <ResourceTable<T>
        title={config.label}
        type={config.key}
        entries={items}
        count={count}
        error={error}
        columns={config.columns}
        isLoading={isLoading}
        onAdd={config.actions.add}
        onDelete={config.actions.remove}
        onModify={config.actions.modify}
      />
    </Grid>
  );
};
