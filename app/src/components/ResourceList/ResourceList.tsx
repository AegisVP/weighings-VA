import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Loader } from '../Loader/Loader';

// import type { GridSize } from '@mui/material';
import type { ResourceDef } from '../../resources/resources';
import { useDispatch, useSelector } from 'react-redux';
import type { TypeRootReduxState } from '../../redux/store';
import type { TypeApiError } from '../../redux/types';

export type RendererDef<T> = React.ComponentType<RendererProps<T>>;
export type BaseRenderer<T> = { renderer?: RendererDef<T> };
export type RendererProps<T> = { row: T };

export type ColumnDef<T> = {
  id: keyof T;
  label: string;
  width?: number;
  renderer?: RendererDef<T>;
  type?: 'text' | 'boolean' | 'singleSelect';
  valueOptions?: { value: string; label: string }[];
};

export type RenderTableCellProps<T> =
  | {
      type: 'value';
      value: string;
    }
  | {
      type: 'row';
      columnId: ColumnDef<T>['id'];
      row: T;
      renderer?: RendererDef<T>;
    };
export const RenderTableCell = <T,>(props: RenderTableCellProps<T>) => {
  if (props.type === 'value') return <TableCell>{props.value}</TableCell>;

  const { row, columnId, renderer: Renderer } = props;

  if (Renderer && typeof Renderer === 'function') {
    return (
      <TableCell>
        <Renderer row={row} />
      </TableCell>
    );
  }

  let cellValue: React.ReactNode;
  switch (typeof row[columnId]) {
    case 'string':
    case 'number':
      cellValue = row[columnId];
      break;
    case 'boolean':
      cellValue = (
        <Box display="flex" justifyContent="center">
          <Checkbox checked={row[columnId]} disabled />
        </Box>
      );
      break;
    case 'undefined':
    default:
      break;
  }

  return <TableCell>{cellValue}</TableCell>;
};

type ResourceTableRowProps<T> = {
  columns: ColumnDef<T>[];
  row: T;
};
export const ResourceTableRow = <T,>({ columns, row }: ResourceTableRowProps<T>) => (
  <TableRow>
    {columns.map(({ id: columnId, renderer }, idx) => (
      <RenderTableCell<T> key={String(columnId) + idx} type="row" row={row} columnId={columnId} renderer={renderer} />
    ))}
  </TableRow>
);

type ResourceListProps<T> = {
  config: ResourceDef<T>;
};
export const ResourceList = <T,>({ config }: ResourceListProps<T>) => {
  const dispatch = useDispatch();
  const { items, count, isLoading, error } = useSelector((state: TypeRootReduxState) => config.selector(state));

  useEffect(() => {
    if (isLoading) return;
    if (count !== undefined) return;
    if (error) return;

    config.actions.load(dispatch)();
  }, [dispatch, config, isLoading, count, error]);

  // const handleAdd = (item: T) => config.actions.add(dispatch)(item);
  // const handleDelete = (id: string) => config.actions.delete(dispatch)(id);

  return (
    <Grid key={config.key} size={config.cardSize}>
      <ResourceTable<T>
        title={config.label}
        entries={items}
        count={count}
        error={error}
        columns={config.columns}
        isLoading={isLoading}
        // onAdd={handleAdd}
        // onDelete={handleDelete}
      />
    </Grid>
  );
};

type ResourceTableProps<T = Record<string, React.ReactNode>> = {
  title: string;
  entries: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  error?: TypeApiError;
  count?: number;
};
export const ResourceTable = <T,>({ title, entries, count, columns, isLoading, error }: ResourceTableProps<T>) => (
  <Box
    p={2}
    borderRadius={2}
    boxShadow="2px 2px 6px #ddd"
    display="flex"
    flexDirection="column"
    alignItems="center"
    gap={2}
  >
    <Typography variant="h6">{title}</Typography>
    {isLoading ? (
      <Loader />
    ) : error || count === undefined ? (
      <Alert severity="error">{error || 'Сталася помилка'}</Alert>
    ) : (
      <Table size="small" sx={{ boxShadow: '0px 0px 1px 1px #ddd', borderRadius: '4px' }}>
        <TableHead>
          <TableRow>
            {columns.map(({ id, label, width }: ColumnDef<T>) => (
              <TableCell key={String(id) + label} width={`${width}%`}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((row, idx) => (
            <ResourceTableRow<T> key={idx} columns={columns} row={row} />
          ))}
        </TableBody>
      </Table>
    )}
  </Box>
);
