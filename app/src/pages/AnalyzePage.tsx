import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectWeighings, selectWeighingsLoading } from '../redux/weighings/weighingsSelectors';
import { selectCrop, selectLocation, selectMachine, selectOperator } from '../redux/resources/resourcesSelectors';
import { searchWeighing } from '../redux/weighings/weighingsOperations';
import { Loader } from '../components/Loader/Loader';
import { WeighingTable } from '../components/WeighingTable/WeighingTable';
import { constants } from '../constants/constants';
import { selectUserLocale } from '../redux/user/userSelectors';

type TypeDateRangePreset = 'custom' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month' | 'this_year';

export const AnalyzePage = () => {
  const { formatMessage } = useIntl();
  const locale = useAppSelector(selectUserLocale);
  const dispatch = useAppDispatch();
  const weighings = useAppSelector(selectWeighings);
  const isLoading = useAppSelector(selectWeighingsLoading);
  const crops = useAppSelector(selectCrop);
  const locations = useAppSelector(selectLocation);
  const machines = useAppSelector(selectMachine);
  const operators = useAppSelector(selectOperator);
  const [filterDateRangePreset, setFilterDateRangePreset] = useState<TypeDateRangePreset>('today');

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

  const [filterCrop, setFilterCrop] = useState<string>('');
  const [filterSource, setFilterSource] = useState<string>('');
  const [filterDestination, setFilterDestination] = useState<string>('');
  const [filterDeliveryOperator, setFilterDeliveryOperator] = useState<string>('');
  const [filterHarvesterOperator, setFilterHarvesterOperator] = useState<string>('');

  const handleDateChange = (newStartDateRaw: Date | null, newEndDateRaw: Date | null) => {
    setFilterDateRangePreset('custom');
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

  const filteredWeighings = useMemo(() => {
    let result = [...weighings];

    if (filterCrop) result = result.filter((w) => w.crop === filterCrop);
    if (filterSource) result = result.filter((w) => w.sourceLocation === filterSource);
    if (filterDestination) result = result.filter((w) => w.destinationLocation === filterDestination);
    if (filterDeliveryOperator) result = result.filter((w) => w.deliveryOperator === filterDeliveryOperator);
    if (filterHarvesterOperator) result = result.filter((w) => w.harvesterOperator === filterHarvesterOperator);

    return result;
  }, [weighings, filterCrop, filterSource, filterDestination, filterDeliveryOperator, filterHarvesterOperator]);

  const totalWeight = useMemo(() => {
    return filteredWeighings.reduce((sum, weighing) => sum + weighing.weightNetto, 0);
  }, [filteredWeighings]);

  const findById = <T extends { id: string }>(items: T[], id: string) => items.find((i) => i.id === id);

  const markDeleted = (c: { id: string; name: string; deletedAt?: string | null | undefined }) =>
    c.deletedAt ? { id: c.id, name: c.name + ' (видалено)' } : { id: c.id, name: c.name };

  const getCropName = (id: string) => {
    const item = findById(crops.items, id);
    return item ? markDeleted({ id, name: item.name, deletedAt: item.deletedAt }).name : '';
  };

  const getLocationName = (id: string) => {
    const item = findById(locations.items, id);
    return item ? markDeleted({ id, name: item.name, deletedAt: item.deletedAt }).name : '';
  };

  const getOperatorName = (id: string) => {
    const item = findById(operators.items, id);
    return item ? markDeleted({ id, name: item.name, deletedAt: item.deletedAt }).name : '';
  };

  const getMachineDescription = (id: string) => {
    const item = findById(machines.items, id);
    return item ? markDeleted({ id, name: item.description, deletedAt: item.deletedAt }).name : '';
  };

  const setToday = () => {
    const start = new Date();
    const end = new Date();
    handleDateChange(start, end);
    setFilterDateRangePreset('today');
  };

  const setYesterday = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const end = new Date(start);
    handleDateChange(start, end);
    setFilterDateRangePreset('yesterday');
  };

  const setThisWeek = () => {
    const now = new Date();
    const start = new Date(now);
    const diff = (start.getDay() || 7) - 1; // Monday as first day
    start.setDate(start.getDate() - diff);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    handleDateChange(start, end);
    setFilterDateRangePreset('this_week');
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    handleDateChange(start, end);
    setFilterDateRangePreset('this_month');
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    handleDateChange(start, end);
    setFilterDateRangePreset('last_month');
  };

  const setThisYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    handleDateChange(start, end);
    setFilterDateRangePreset('this_year');
  };

  const resetAllFilters = () => {
    setFilterCrop('');
    setFilterSource('');
    setFilterDestination('');
    setFilterDeliveryOperator('');
    setFilterHarvesterOperator('');
  };

  const getVar = (preset: TypeDateRangePreset) => (filterDateRangePreset === preset ? 'contained' : 'outlined');

  const isFilterSet =
    !!filterCrop || !!filterSource || !!filterDestination || !!filterDeliveryOperator || !!filterHarvesterOperator;

  const optionAll = { id: '', name: formatMessage({ id: 'analyze_page.filters.option_all' }) };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="analyze_page.title" />
        </Typography>

        {/* Date Range Picker */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage id="analyze_page.date_range.title" />
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DatePicker
                  label={formatMessage({ id: 'analyze_page.date_range.from' })}
                  value={startDate}
                  onChange={(date: Date | null) => handleDateChange(date, endDate)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <DatePicker
                  label={formatMessage({ id: 'analyze_page.date_range.to' })}
                  value={endDate}
                  onChange={(date: Date | null) => handleDateChange(startDate, date)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <ButtonGroup size="small" variant="outlined">
                  <Button variant={getVar('today')} onClick={setToday}>
                    <FormattedMessage id="analyze_page.date_range.today" />
                  </Button>
                  <Button variant={getVar('yesterday')} onClick={setYesterday}>
                    <FormattedMessage id="analyze_page.date_range.yesterday" />
                  </Button>
                  <Button variant={getVar('this_week')} onClick={setThisWeek}>
                    <FormattedMessage id="analyze_page.date_range.this_week" />
                  </Button>
                  <Button variant={getVar('this_month')} onClick={setThisMonth}>
                    <FormattedMessage id="analyze_page.date_range.this_month" />
                  </Button>
                  <Button variant={getVar('last_month')} onClick={setLastMonth}>
                    <FormattedMessage id="analyze_page.date_range.last_month" />
                  </Button>
                  <Button variant={getVar('this_year')} onClick={setThisYear}>
                    <FormattedMessage id="analyze_page.date_range.this_year" />
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </LocalizationProvider>
        </Card>

        {/* Filters */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              <FormattedMessage id="analyze_page.filters.title" />
            </Typography>
            {isFilterSet && (
              <Button size="small" variant="outlined" color="secondary" onClick={resetAllFilters}>
                <FormattedMessage id="analyze_page.filters.reset" />
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[optionAll, ...crops.items].map(markDeleted)}
                getOptionLabel={(option) => option.name}
                value={crops.items.find((c) => c.id === filterCrop) || optionAll}
                onChange={(_, newValue) => setFilterCrop(newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label={formatMessage({ id: 'analyze_page.filters.crop' })} />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[optionAll, ...locations.items.filter((l) => l.isSource)].map(markDeleted)}
                getOptionLabel={(option) => option.name}
                value={locations.items.find((l) => l.id === filterSource) || optionAll}
                onChange={(_, newValue) => setFilterSource(newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label={formatMessage({ id: 'analyze_page.filters.source' })} />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[optionAll, ...locations.items.filter((l) => l.isDestination)].map(markDeleted)}
                getOptionLabel={(option) => option.name}
                value={locations.items.find((l) => l.id === filterDestination) || optionAll}
                onChange={(_, newValue) => setFilterDestination(newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label={formatMessage({ id: 'analyze_page.filters.destination' })} />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[optionAll, ...operators.items].map(markDeleted)}
                getOptionLabel={(option) => option.name}
                value={operators.items.find((o) => o.id === filterDeliveryOperator) || optionAll}
                onChange={(_, newValue) => setFilterDeliveryOperator(newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label={formatMessage({ id: 'analyze_page.filters.driver' })} />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 180 }}>
              <Autocomplete
                size="small"
                options={[optionAll, ...operators.items].map(markDeleted)}
                getOptionLabel={(option) => option.name}
                value={operators.items.find((o) => o.id === filterHarvesterOperator) || optionAll}
                onChange={(_, newValue) => setFilterHarvesterOperator(newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label={formatMessage({ id: 'analyze_page.filters.harvester' })} />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
          </Box>
        </Card>

        {/* Results count and total weight */}
        <Card sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, m: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage
                id={'analyze_page.filters.results.found_entries'}
                values={{ count: filteredWeighings.length }}
              />
            </Typography>
            <Typography variant="body2" color="text.primary">
              <FormattedMessage
                id={'analyze_page.filters.results.total_weight'}
                values={{
                  strong: (chunks) => <strong>{chunks}</strong>,
                  weight: totalWeight.toLocaleString(constants.localeLang[locale]),
                }}
              />
            </Typography>
          </Box>
        </Card>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : (
          <WeighingTable
            weighings={filteredWeighings}
            getCropName={getCropName}
            getLocationName={getLocationName}
            getOperatorName={getOperatorName}
            getMachineDescription={getMachineDescription}
            showCrop={true}
          />
        )}
      </Box>
    </Container>
  );
};
