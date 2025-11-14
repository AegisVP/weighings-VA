import { useState } from 'react';
import { Button, Card, CardContent, Grid, Typography, Box } from '@mui/material';

import { WeighingEntryForm } from '../components/WeighingEntryForm/WeighingEntryForm';
import { WeighingTable } from '../components/WeighingTable/WeighingTable';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWeighings } from '../redux/weighings/weighingsSelectors';
import { selectCrop, selectLocation, selectMachine, selectOperator } from '../redux/resources/resourcesSelectors';

import type { SubmitHandler } from 'react-hook-form';
import type { TypeWeighingInput } from '../components/WeighingEntryForm/WeighingEntryForm';
import { addWeighing } from '../redux/weighings/weighingsOperations';

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
  const dispatch = useAppDispatch();
  const [weighingsInProgress, setWeighingsInProgress] = useState<{ id: number }[]>([]);
  const weighings = useAppSelector(selectWeighings);
  const sortedWeighings = [...weighings].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );
  const crops = useAppSelector(selectCrop).items;
  const locations = useAppSelector(selectLocation).items;
  const machines = useAppSelector(selectMachine).items;
  const operators = useAppSelector(selectOperator).items;

  const getCropName = (id: string) => crops.find((c) => c.id === id)?.name || id;
  const getLocationName = (id: string) => locations.find((l) => l.id === id)?.name || id;
  const getOperatorName = (id: string) => operators.find((o) => o.id === id)?.name || id;
  const getMachineDescription = (id: string) => machines.find((m) => m.id === id)?.description || id;

  const newWeighing = () => {
    const newWip = { id: Date.now() };
    setWeighingsInProgress((wipList) => [...wipList, newWip]);
  };

  const onSubmit: SubmitHandler<TypeWeighingInput> = (data) => {
    defaultValues.sourceLocation = data.sourceLocation;
    defaultValues.destinationLocation = data.destinationLocation;
    defaultValues.crop = data.crop;

    setWeighingsInProgress((wipList) => wipList.filter((wip) => wip.id !== new Date(data.dateTime).getTime()));

    dispatch(addWeighing({ ...data }));
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
                Історія зважувань ({sortedWeighings.length})
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
                Нове зважування
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
