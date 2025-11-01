import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Typography,
} from '@mui/material';
import { DataGrid, GridRowModes, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
import type { GridColDef, GridRowId, GridRowModel, GridRowModesModel, GridEventListener } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Loader } from '../Loader/Loader';
import type { ResourceDef } from '../../resources/resources';
import { useDispatch, useSelector } from 'react-redux';
import type { TypeRootReduxState } from '../../redux/store';

type ResourceDataGridProps<T extends { id: string }> = {
  config: ResourceDef<T>;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

export const ResourceDataGrid = <T extends { id: string }>({ config }: ResourceDataGridProps<T>) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state: TypeRootReduxState) => state);
  const { items, count, isLoading, error } = config.selector(reduxState);
  
  const [rows, setRows] = useState<T[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const [uniqueFieldErrors, setUniqueFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isLoading) return;
    if (count !== undefined) return;
    if (error) return;

    config.actions.load(dispatch)();
  }, [dispatch, config, isLoading, count, error]);

  useEffect(() => {
    setRows(items);
  }, [items]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await config.actions.remove(dispatch)(id as string);
      setSnackbar({ open: true, message: 'Запис успішно видалено', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Помилка при видаленні запису', severity: 'error' });
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow && String(editedRow.id).startsWith('temp-')) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const validateUniqueFields = useCallback((updatedRow: T): boolean => {
    const errors: Record<string, string> = {};
    const rowData = updatedRow as Record<string, unknown>;
    
    // Check for 'name' field uniqueness
    if ('name' in updatedRow) {
      const nameValue = rowData.name;
      const duplicate = items.find(
        (item) => item.id !== updatedRow.id && (item as Record<string, unknown>).name === nameValue
      );
      if (duplicate) {
        errors[updatedRow.id] = 'Назва має бути унікальною';
      }
    }

    // Check for 'licensePlate' field uniqueness (for machines)
    if ('licensePlate' in updatedRow) {
      const plateValue = rowData.licensePlate;
      const duplicate = items.find(
        (item) => item.id !== updatedRow.id && (item as Record<string, unknown>).licensePlate === plateValue
      );
      if (duplicate) {
        errors[updatedRow.id] = 'Номерний знак має бути унікальним';
      }
    }

    setUniqueFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [items]);

  const processRowUpdate = async (newRow: GridRowModel): Promise<T> => {
    const updatedRow = { ...newRow } as T;
    
    // Validate unique fields
    if (!validateUniqueFields(updatedRow)) {
      throw new Error(uniqueFieldErrors[updatedRow.id] || 'Validation failed');
    }

    const isNew = String(updatedRow.id).startsWith('temp-');
    
    try {
      if (isNew) {
        // Remove temporary id and other metadata fields for new row
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, deletedAt, ...newData } = updatedRow as Record<string, unknown>;
        await config.actions.add(dispatch)(newData as Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>);
        setSnackbar({ open: true, message: 'Запис успішно створено', severity: 'success' });
      } else {
        await config.actions.modify(dispatch)(updatedRow);
        setSnackbar({ open: true, message: 'Запис успішно оновлено', severity: 'success' });
      }
      return updatedRow;
    } catch (err) {
      setSnackbar({ open: true, message: 'Помилка при збереженні запису', severity: 'error' });
      throw err;
    }
  };

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    setSnackbar({ open: true, message: error.message, severity: 'error' });
  }, []);

  const handleAddClick = () => {
    const id = `temp-${Date.now()}`;
    const newRow: Record<string, unknown> = { id };
    
    // Initialize default values based on config columns
    config.columns.forEach((col) => {
      if (col.id === 'name') {
        newRow[String(col.id)] = '';
      } else if (col.id === 'isSource' || col.id === 'isDestination') {
        newRow[String(col.id)] = false;
      } else if (col.type === 'singleSelect') {
        // Get the first option for select fields
        const options = config.getColumnOptions?.(reduxState, col.id) || col.valueOptions;
        if (options && options.length > 0) {
          newRow[String(col.id)] = options[0].value;
        } else {
          newRow[String(col.id)] = '';
        }
      } else if (col.id !== 'id') {
        newRow[String(col.id)] = '';
      }
    });

    setRows((oldRows) => [...oldRows, newRow as T]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: config.columns[0]?.id as string },
    }));
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRowDoubleClick = (params: { id: GridRowId }) => {
    setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
  };

  // Build column definitions from config
  const columns: GridColDef[] = [
    ...config.columns.map((col) => {
      const colDef: Record<string, unknown> = {
        field: String(col.id),
        headerName: col.label,
        flex: col.width ? col.width / 100 : 1,
        editable: true,
      };

      // Handle different column types
      if (col.type === 'boolean' || col.id === 'isSource' || col.id === 'isDestination') {
        colDef.type = 'boolean';
      } else if (col.type === 'singleSelect') {
        colDef.type = 'singleSelect';
        // Get options from config function or column definition
        const options = config.getColumnOptions?.(reduxState, col.id) || col.valueOptions;
        if (options) {
          colDef.valueOptions = options;
          // Add valueGetter to display the label instead of the value
          colDef.valueGetter = (value: string) => {
            const option = options.find((opt) => opt.value === value);
            return option ? option.label : value;
          };
        }
      }

      return colDef as GridColDef;
    }),
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Дії',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  if (isLoading && items.length === 0) {
    return (
      <Box
        p={2}
        borderRadius={2}
        boxShadow="2px 2px 6px #ddd"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography variant="h6">{config.label}</Typography>
        <Loader />
      </Box>
    );
  }

  if (error && count === undefined) {
    return (
      <Box
        p={2}
        borderRadius={2}
        boxShadow="2px 2px 6px #ddd"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography variant="h6">{config.label}</Typography>
        <Alert severity="error">{error || 'Сталася помилка'}</Alert>
      </Box>
    );
  }

  return (
    <Box
      p={2}
      borderRadius={2}
      boxShadow="2px 2px 6px #ddd"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h6">{config.label}</Typography>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          onRowDoubleClick={handleRowDoubleClick}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          sx={{
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-start">
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          variant="contained"
        >
          Додати запис
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
