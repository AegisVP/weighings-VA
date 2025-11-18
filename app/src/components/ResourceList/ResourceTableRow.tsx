import { useCallback, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { ResourceTableCell } from './ResourceTableCell';

import type { ColumnDef, RendererProps } from './ResourceList';
import type { ModifyResourcePayload } from '../../resources/resources';

type ResourceTableRowProps<T extends { id: string }> = {
  columns: ColumnDef<T>[];
  row: T;
  onDelete: (id: string) => void;
  onModify: (item: ModifyResourcePayload<T>) => void;
};
export const ResourceTableRow = <T extends { id: string }>({
  columns,
  row,
  onDelete,
  onModify,
}: ResourceTableRowProps<T>) => {
  const resetRowData = useCallback(() => {
    const acc = {} as Partial<Record<Extract<keyof T, string>, string | number | boolean>>;
    for (const column of columns) {
      const key = column.id as Extract<keyof T, string>;
      acc[key] = row[key] as unknown as string | number | boolean;
    }
    return acc;
  }, [columns, row]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowData, setRowData] =
    useState<Partial<Record<Extract<keyof T, string>, string | number | boolean>>>(resetRowData);

  const handleChange: RendererProps<T>['onChange'] = (e) => {
    if ('preventDefault' in e && typeof e.preventDefault === 'function') e.preventDefault();

    const target = e.target as EventTarget & {
      name?: string;
      value?: string | number | boolean;
      checked?: boolean;
      type?: string;
    };
    const key = target.name as Extract<keyof T, string> | undefined;
    const value = target.type === 'checkbox' ? Boolean(target.checked) : target.value;
    if (!key) return;
    setRowData((prev) => ({
      ...(prev as Partial<Record<Extract<keyof T, string>, string | number | boolean>>),
      [key]: value,
    }));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(row.id);
    setIsDeleting(false);
  };

  const handleModify = async () => {
    setIsSubmitting(true);
    setIsEditing(false);
    await onModify({ ...(rowData as unknown as ModifyResourcePayload<T>), id: row.id } as ModifyResourcePayload<T>);
    setIsSubmitting(false);
  };

  const cancelModify = () => {
    setIsEditing(false);
    setRowData(resetRowData);
  };

  const startModify = () => {
    setRowData(resetRowData);
    setIsEditing(true);
  };

  return (
    <TableRow>
      {columns.map(({ id: columnId, renderer }, idx) => (
        <ResourceTableCell<T>
          key={String(columnId) + idx}
          row={row}
          columnId={columnId}
          renderer={renderer}
          isEditing={isEditing}
          handleChange={handleChange}
          value={rowData[columnId as Extract<keyof T, string>] as string | number | boolean}
        />
      ))}
      <TableCell
        sx={{
          border: '1px solid #ddd',
          paddingLeft: '8px',
          paddingRight: '8px',
          width: '100px',
          whiteSpace: 'nowrap',
        }}
      >
        {isEditing ? (
          <>
            <IconButton onClick={handleModify} disabled={isSubmitting} loading={isSubmitting}>
              <SaveOutlinedIcon />
            </IconButton>
            <IconButton onClick={cancelModify} disabled={isSubmitting}>
              <CloseOutlinedIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton disabled={isDeleting} onClick={startModify}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton disabled={isDeleting} loading={isDeleting} onClick={handleDelete}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};
