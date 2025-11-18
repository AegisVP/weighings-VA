import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Loader } from '../Loader/Loader';
import { ResourceTableRow } from './ResourceTableRow';

import type { Control, FieldValues } from 'react-hook-form';
import type { ColumnDef } from './ResourceList';
import type { TypeApiError } from '../../redux/types';
import type { AddResourcePayload, ModifyResourcePayload, ResourceDefKey } from '../../resources/resources';

const renderInputField = <T,>(column: ColumnDef<T>, control: Control<FieldValues>, error: boolean = false) => {
  return column.type === 'boolean' ? (
    <Controller
      control={control}
      name={String(column.id)}
      render={({ field }) => (
        <Checkbox {...field} checked={field.value} sx={{ marginLeft: 'auto', marginRight: 'auto' }} />
      )}
    />
  ) : column.type === 'singleSelect' && column.valueOptions ? (
    <Controller
      control={control}
      name={String(column.id)}
      render={({ field }) => (
        <FormControl fullWidth sx={{ minWidth: 120 }} size="small" error={!!error}>
          <InputLabel id={`select-${String(column.id)}`}>{column.label}</InputLabel>
          <Select
            {...field}
            id={`select-${String(column.id)}`}
            labelId={`select-${String(column.id)}`}
            label={column.label}
            error={!!error}
            fullWidth
            size="small"
          >
            {column.valueOptions!.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  ) : (
    <Controller
      control={control}
      name={String(column.id)}
      render={({ field }) => <TextField {...field} error={!!error} label={column.label} fullWidth size="small" />}
    />
  );
};

type ResourceTableProps<T extends { id: string }> = {
  title: string;
  type: ResourceDefKey;
  entries: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  error?: TypeApiError;
  count?: number;
  onAdd: (item: AddResourcePayload<T>) => void;
  onDelete: (id: string) => void;
  onModify: (item: ModifyResourcePayload<T>) => void;
};
export const ResourceTable = <T extends { id: string }>({
  title,
  entries,
  count,
  columns,
  isLoading,
  error,
  onAdd,
  onDelete,
  onModify,
}: ResourceTableProps<T>) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValues = columns.reduce((acc, column) => {
    acc[column.id as string] = column.type === 'boolean' ? false : '';
    return acc;
  }, {} as FieldValues);
  const { control, handleSubmit, formState, reset } = useForm({ defaultValues });
  const { errors: addErrors } = formState;

  const handleAdd = async (data: FieldValues) => {
    try {
      setIsSubmitting(true);
      await onAdd(data as AddResourcePayload<T>);
      setIsAdding(false);
      reset(defaultValues);
    } catch (e) {
      console.error('Error adding resource:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAdd = () => {
    reset(defaultValues);
    setIsAdding(!isAdding);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleAdd)}
      p={2}
      borderRadius={2}
      boxShadow="2px 2px 6px #ddd"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h6">{title}</Typography>
      {isLoading || count === undefined ? (
        <Loader />
      ) : error ? (
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
              <ResourceTableRow<T> key={idx} columns={columns} row={row} onDelete={onDelete} onModify={onModify} />
            ))}
            {isAdding && (
              <>
                <TableRow selected>
                  {columns.map((column) => (
                    <TableCell key={column.id as React.Key} sx={{ textAlign: 'center', borderBottom: '0' }}>
                      {renderInputField<T>(column, control, !!addErrors[column.id as string])}
                    </TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'center', borderBottom: '0' }}>
                    <IconButton
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      sx={{ marginLeft: 'auto', marginRight: 'auto' }}
                    >
                      <SaveOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {addErrors?.root?.message ? (
                  <TableRow selected sx={{}}>
                    <TableCell
                      colSpan={columns.length + 1}
                      sx={{ textAlign: 'center', color: 'red', fontSize: '0.875rem' }}
                    >
                      {addErrors?.root?.message}
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length} style={{ paddingTop: '0', borderBottomWidth: '0' }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 0 }}
                  onClick={handleToggleAdd}
                  endIcon={isAdding ? <CloseOutlinedIcon /> : <AddOutlinedIcon />}
                >
                  {isAdding ? 'Відмінити' : 'Додати'}
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Box>
  );
};
