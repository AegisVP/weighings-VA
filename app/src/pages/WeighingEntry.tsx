import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { WeighingEntryForm } from '../components/WeighingEntryForm/WeighingEntryForm';
import { WeighingTable } from '../components/WeighingTable/WeighingTable';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWeighings } from '../redux/weighings/weighingsSelectors';
import { selectCrops, selectLocations, selectMachines, selectOperators } from '../redux/resources/resourcesSelectors';
import { addWeighing } from '../redux/weighings/weighingsOperations';

import type { SubmitHandler } from 'react-hook-form';
import type { TypeWeighingInput } from '../components/WeighingEntryForm/WeighingEntryForm';
import { useIntl } from 'react-intl';

const defaultValues: TypeWeighingInput = {
  deliveryMachine: '',
  deliveryOperator: '',
  harvesterMachine: '',
  harvesterOperator: '',
  sourceLocation: '',
  destinationLocation: '',
  crop: '',
  weightGross: 0,
  weightTare: 0,
  weightNetto: 0,
  dateTime: new Date().toISOString(),
};

export const WeighingEntry = () => {
  const { formatMessage } = useIntl();
  const { username } = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [weighingsInProgress, setWeighingsInProgress] = useState<{ id: number }[]>([]);
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

  const newWeighing = () => {
    const newWip = { id: Date.now() };
    setWeighingsInProgress((wipList) => [...wipList, newWip]);
  };

  const onSubmit: SubmitHandler<TypeWeighingInput> = async (data) => {
    defaultValues.sourceLocation = data.sourceLocation;
    defaultValues.destinationLocation = data.destinationLocation;
    defaultValues.crop = data.crop;

    try {
      const res = await dispatch(addWeighing({ ...data, createdBy: username })).unwrap();
      setWeighingsInProgress((wipList) => wipList.filter((wip) => wip.id !== new Date(data.dateTime).getTime()));
      console.log({ res });
    } catch (error) {
      console.error('Error adding weighing:', error);
    }
  };

  return (
    <Grid container spacing={2} padding={2}>
      {weighingsInProgress.map((wip) => (
        <WeighingEntryForm
          key={wip.id}
          defaultValues={{ ...defaultValues, dateTime: new Date(wip.id).toISOString() }}
          onSubmit={onSubmit}
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
                onClick={() => newWeighing()}
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
