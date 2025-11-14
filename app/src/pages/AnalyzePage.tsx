import { useMemo, useState } from 'react';
import { Autocomplete, Box, Button, ButtonGroup, Card, Container, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectWeighings, selectWeighingsLoading } from '../redux/weighings/weighingsSelectors';
import { selectCrop, selectLocation, selectMachine, selectOperator } from '../redux/resources/resourcesSelectors';
import { searchWeighing } from '../redux/weighings/weighingsOperations';
import { Loader } from '../components/Loader/Loader';
import { WeighingTable } from '../components/WeighingTable/WeighingTable';

export const AnalyzePage = () => {
  const dispatch = useAppDispatch();
  const weighings = useAppSelector(selectWeighings);
  const isLoading = useAppSelector(selectWeighingsLoading);
  const crops = useAppSelector(selectCrop);
  const locations = useAppSelector(selectLocation);
  const machines = useAppSelector(selectMachine);
  const operators = useAppSelector(selectOperator);

  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });

  // Filter state
  const [filterCrop, setFilterCrop] = useState<string>('');
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterDestination, setFilterDestination] = useState<string>('');
  const [filterDeliveryOperator, setFilterDeliveryOperator] = useState<string>('');
  const [filterHarvesterOperator, setFilterHarvesterOperator] = useState<string>('');

  // Handle date range change - triggers API call
  const handleDateChange = (newStartDateRaw: Date | null, newEndDateRaw: Date | null) => {
    let newStartDate = startDate;
    let newEndDate = endDate;
    if (newStartDateRaw) {
      newStartDate = new Date(newStartDateRaw);
      newStartDate.setHours(0, 0, 0, 0);
      setStartDate(newStartDate);
    }
    if (newEndDateRaw) {
      newEndDate = new Date(newEndDateRaw);
      newEndDate.setHours(23, 59, 59, 999);
      setEndDate(newEndDate);
    }

    if (newStartDate && newEndDate) {
      dispatch(
        searchWeighing({
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        })
      );
    }
  };

  // Filter weighings (client-side)
  const filteredWeighings = useMemo(() => {
    let result = [...weighings];

    // Apply filters
    if (filterCrop) result = result.filter((w) => w.crop === filterCrop);
    if (filterSource) result = result.filter((w) => w.sourceLocation === filterSource);
    if (filterDestination) result = result.filter((w) => w.destinationLocation === filterDestination);
    if (filterDeliveryOperator) result = result.filter((w) => w.deliveryOperator === filterDeliveryOperator);
    if (filterHarvesterOperator) result = result.filter((w) => w.harvesterOperator === filterHarvesterOperator);

    return result;
  }, [weighings, filterCrop, filterSource, filterDestination, filterDeliveryOperator, filterHarvesterOperator]);

  // Calculate total weight
  const totalWeight = useMemo(() => {
    return filteredWeighings.reduce((sum, weighing) => sum + weighing.weightNetto, 0);
  }, [filteredWeighings]);

  // Helper to get name by id
  const getLocationName = (id: string) => locations.items.find((l) => l.id === id)?.name || id;
  const getOperatorName = (id: string) => operators.items.find((o) => o.id === id)?.name || id;
  const getMachineDescription = (id: string) => machines.items.find((m) => m.id === id)?.description || id;

  // Date range preset handlers
  const setToday = () => {
    const start = new Date();
    // start.setHours(0, 0, 0, 0);
    const end = new Date();
    // end.setHours(23, 59, 59, 999);
    handleDateChange(start, end);
  };

  const setYesterday = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    // start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    // end.setHours(23, 59, 59, 999);
    handleDateChange(start, end);
  };

  const setThisWeek = () => {
    const now = new Date();
    const start = new Date(now);
    const diff = (start.getDay() || 7) - 1; // Monday as first day
    start.setDate(start.getDate() - diff);
    // start.setHours(0, 0, 0, 0);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    // end.setHours(23, 59, 59, 999);
    handleDateChange(start, end);
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    // start.setHours(0, 0, 0, 0);
    const end = new Date();
    // end.setHours(23, 59, 59, 999);
    handleDateChange(start, end);
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // start.setHours(0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    // end.setHours(23, 59, 59, 999);
    handleDateChange(start, end);
  };

  const setThisYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    // start.setHours(0, 0, 0, 0);
    const end = new Date(now.getFullYear(), 11, 31);
    // end.setHours(23, 59, 59, 999);
    handleDateChange(start, end);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilterCrop('');
    setFilterSource('');
    setFilterDestination('');
    setFilterDeliveryOperator('');
    setFilterHarvesterOperator('');
  };

  const isFilterSet =
    !!filterCrop || !!filterSource || !!filterDestination || !!filterDeliveryOperator || !!filterHarvesterOperator;

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Аналіз зважувань
        </Typography>

        {/* Date Range Picker */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Період
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DatePicker
                  label="Дата початку"
                  value={startDate}
                  onChange={(date: Date | null) => handleDateChange(date, endDate)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DatePicker
                  label="Дата закінчення"
                  value={endDate}
                  onChange={(date: Date | null) => handleDateChange(startDate, date)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <ButtonGroup size="small" variant="outlined">
                  <Button onClick={setToday}>Сьогодні</Button>
                  <Button onClick={setYesterday}>Вчора</Button>
                  <Button onClick={setThisWeek}>Цей тиждень</Button>
                  <Button onClick={setThisMonth}>Цей місяць</Button>
                  <Button onClick={setLastMonth}>Минулий місяць</Button>
                  <Button onClick={setThisYear}>Цей рік</Button>
                </ButtonGroup>
              </Box>
            </Box>
          </LocalizationProvider>
        </Card>

        {/* Filters */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Фільтри</Typography>
            {isFilterSet && (
              <Button size="small" variant="outlined" color="secondary" onClick={resetAllFilters}>
                Скинути фільтри
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[{ id: '', name: 'Всі' }, ...crops.items]}
                getOptionLabel={(option) => option.name}
                value={crops.items.find((c) => c.id === filterCrop) || { id: '', name: 'Всі' }}
                onChange={(_, newValue) => setFilterCrop(newValue?.id || '')}
                renderInput={(params) => <TextField {...params} label="Культура" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[{ id: '', name: 'Всі' }, ...locations.items.filter((l) => l.isSource)]}
                getOptionLabel={(option) => option.name}
                value={locations.items.find((l) => l.id === filterSource) || { id: '', name: 'Всі' }}
                onChange={(_, newValue) => setFilterSource(newValue?.id || '')}
                renderInput={(params) => <TextField {...params} label="Джерело" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[{ id: '', name: 'Всі' }, ...locations.items.filter((l) => l.isDestination)]}
                getOptionLabel={(option) => option.name}
                value={locations.items.find((l) => l.id === filterDestination) || { id: '', name: 'Всі' }}
                onChange={(_, newValue) => setFilterDestination(newValue?.id || '')}
                renderInput={(params) => <TextField {...params} label="Призначення" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[{ id: '', name: 'Всі' }, ...operators.items]}
                getOptionLabel={(option) => option.name}
                value={operators.items.find((o) => o.id === filterDeliveryOperator) || { id: '', name: 'Всі' }}
                onChange={(_, newValue) => setFilterDeliveryOperator(newValue?.id || '')}
                renderInput={(params) => <TextField {...params} label="Водій" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[{ id: '', name: 'Всі' }, ...operators.items]}
                getOptionLabel={(option) => option.name}
                value={
                  operators.items.find((o) => o.id === filterHarvesterOperator) || {
                    id: '',
                    name: 'Всі',
                  }
                }
                onChange={(_, newValue) => setFilterHarvesterOperator(newValue?.id || '')}
                renderInput={(params) => <TextField {...params} label="Комбайнер" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
          </Box>
        </Card>

        {/* Results count and total weight */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, m: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Знайдено записів: <strong>{filteredWeighings.length}</strong>
            </Typography>
            <Typography variant="body2" color="text.primary">
              Загальна вага: <strong>{totalWeight.toLocaleString('uk-UA')} кг</strong>
            </Typography>
          </Box>
        </Card>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : (
          <WeighingTable
            weighings={filteredWeighings}
            getLocationName={getLocationName}
            getOperatorName={getOperatorName}
            getMachineDescription={getMachineDescription}
            showCrop={false}
          />
        )}
      </Box>
    </Container>
  );
};
