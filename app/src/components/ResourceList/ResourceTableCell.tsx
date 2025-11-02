import { Box, Checkbox, Input, TableCell } from '@mui/material';
import type { ColumnDef, RendererDef, RendererProps } from './ResourceList';

type ResourceTableCellProps<T> = {
  columnId: ColumnDef<T>['id'];
  row: T;
  renderer?: RendererDef<T>;
  handleChange: RendererProps<T>['onChange'];
  isEditing: boolean;
  value: string | number | boolean;
};
export const ResourceTableCell = <T,>({
  columnId,
  row,
  renderer: Renderer,
  handleChange,
  isEditing,
  value,
}: ResourceTableCellProps<T>) => {
  if (Renderer && typeof Renderer === 'function') {
    return (
      <TableCell>
        <Renderer row={row} onChange={handleChange} value={value} isEditing={isEditing} />
      </TableCell>
    );
  }

  let cellValue: React.ReactNode;
  switch (typeof row[columnId]) {
    case 'string':
    case 'number':
      cellValue = isEditing ? <Input name={String(columnId)} value={value} onChange={handleChange} /> : row[columnId];
      break;
    case 'boolean':
      cellValue = (
        <Box display="flex" justifyContent="center">
          <Checkbox
            name={String(columnId)}
            checked={isEditing ? (value as boolean) ?? row[columnId] : row[columnId]}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </Box>
      );
      break;
    case 'undefined':
    default:
      break;
  }

  return <TableCell>{cellValue}</TableCell>;
};
