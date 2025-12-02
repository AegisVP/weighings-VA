import { useIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { WeighingEntryForm } from '../components/WeighingEntryForm/WeighingEntryForm';
import { WeighingTable } from '../components/WeighingTable/WeighingTable';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCrops, selectLocations, selectMachines, selectOperators } from '../redux/resources/resourcesSelectors';
import { selectWeighings, selectWeighingsInProgress } from '../redux/weighings/weighingsSelectors';
import { newWeighingInProgress } from '../redux/weighings/weighingsSlice';
import { defaultValues } from '../redux/weighings/weighingsOperations';

import type { TypeWeighingInput } from '../components/WeighingEntryForm/WeighingEntryForm';

export const WeighingEntry = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const weighingsInProgress = useAppSelector(selectWeighingsInProgress);
  const weighings = useAppSelector(selectWeighings);
  const sortedWeighings = [...weighings].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
  const crops = useAppSelector(selectCrops());
  const locations = useAppSelector(selectLocations());
  const machines = useAppSelector(selectMachines());
  const operators = useAppSelector(selectOperators());

  const getCropName = (id: string) => crops.find((c) => c.id === id)?.name || id;
  const getLocationName = (id: string) => locations.find((l) => l.id === id)?.name || id;
  const getOperatorName = (id: string) => operators.find((o) => o.id === id)?.name || id;
  const getMachineDescription = (id: string) => machines.find((m) => m.id === id)?.description || id;

  const newWeighing = () => dispatch(newWeighingInProgress(new Date().toISOString()));

  const setDefaultValues = (data: TypeWeighingInput) => {
    defaultValues.sourceLocation = data.sourceLocation;
    defaultValues.destinationLocation = data.destinationLocation;
    defaultValues.crop = data.crop;
  };

  return (
    <Grid container spacing={2} padding={2}>
      {weighingsInProgress.map((wip) => (
        <WeighingEntryForm
          key={wip.dateTime}
          dateTime={wip.dateTime}
          defaultValues={wip}
          setDefaultValues={setDefaultValues}
        />
      ))}
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 9 }}>
              <Typography variant="h6" whiteSpace="nowrap">
                {formatMessage({ id: 'weighing_entry.recent_weighings' }, { count: sortedWeighings.length })}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ height: 40, whiteSpace: 'nowrap' }}
                fullWidth
                onClick={newWeighing}
              >
                {formatMessage({ id: 'weighing_entry.new_weighing' })}
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <WeighingTable
              weighings={sortedWeighings}
              getLocationName={getLocationName}
              getOperatorName={getOperatorName}
              getMachineDescription={getMachineDescription}
              showCrop={true}
              getCropName={getCropName}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};
