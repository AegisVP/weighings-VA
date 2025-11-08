import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import type { ControllerRenderProps, FieldError } from 'react-hook-form';
import type { TypeWeighingInput } from '../WeighingEntryForm/WeighingEntryForm';

export type SelectFormControlProps<T, K extends keyof TypeWeighingInput> = {
  field: ControllerRenderProps<TypeWeighingInput, K>;
  error?: FieldError;
  label: string;
  items: Partial<T> & { id: string; name: string }[];
  fullWidth?: boolean;
};
export const SelectFormControl = <T, K extends keyof TypeWeighingInput>({
  field,
  error,
  label,
  items,
  fullWidth = true,
}: SelectFormControlProps<T, K>) => {
  return (
    <FormControl fullWidth={fullWidth} size="small" error={!!error}>
      <InputLabel id={`select-${label}`}>{label}</InputLabel>
      <Select {...field} labelId={`select-${label}`} label={label}>
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
