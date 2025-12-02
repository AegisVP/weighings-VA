import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUserLocale } from '../../redux/user/userSelectors';
import { setLocale } from '../../redux/user/userSlice';

import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { TypeUserLocale } from '../../redux/types';

export const LanguageSelector = ({ color = 'white' }: { color?: string }) => {
  const locale = useAppSelector(selectUserLocale);
  const dispatch = useAppDispatch();

  const handleChangeLocale = (event: SelectChangeEvent<TypeUserLocale>) => {
    const newLocale = event.target.value;
    dispatch(setLocale(newLocale));
  };
  return (
    <FormControl size="small" variant="outlined" sx={{ maxWidth: 50 }}>
      <Select
        value={locale}
        variant="outlined"
        autoWidth
        onChange={handleChangeLocale}
        sx={{ color, fontWeight: 'bold' }}
        IconComponent={() => null}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="ua">UA</MenuItem>
      </Select>
    </FormControl>
  );
};
