import z from 'zod';
import { useEffect } from 'react';
import type { FocusEvent } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppSelector } from '../../redux/hooks';
import {
  selectCrops,
  selectLocations,
  selectMachines,
  selectOperators,
} from '../../redux/resources/resourcesSelectors';

import type { Resolver, SubmitHandler } from 'react-hook-form';
import { useIntl } from 'react-intl';

const weighingInputSchema = z.object({
  deliveryMachine: z.uuid(),
  deliveryOperator: z.uuid(),
  harvesterMachine: z.uuid(),
  harvesterOperator: z.uuid(),
  sourceLocation: z.uuid(),
  destinationLocation: z.uuid(),
  crop: z.uuid(),
  weightGross: z.coerce.number().min(0, 'Перевірте значення'),
  weightTare: z.coerce.number().min(0, 'Перевірте значення'),
  weightNetto: z.coerce.number().min(1, 'Перевірте брутто та тару'),
  dateTime: z.string(),
});
export type TypeWeighingInput = z.infer<typeof weighingInputSchema>;

type WeighingEntryFormProps = {
  defaultValues?: TypeWeighingInput;
  onSubmit: SubmitHandler<TypeWeighingInput>;
};
export const WeighingEntryForm = ({ onSubmit, defaultValues }: WeighingEntryFormProps) => {
  const { formatMessage } = useIntl();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TypeWeighingInput>({
    resolver: zodResolver(weighingInputSchema) as unknown as Resolver<TypeWeighingInput>,
    defaultValues,
  });

  const onCalculateNetto = () => {
    const gross = getValues('weightGross') || 0;
    const tare = getValues('weightTare') || 0;
    const netto = gross - tare >= 0 ? gross - tare : 0;

    setValue('weightNetto', netto);

    if (netto <= 0) {
      setError('weightNetto', { type: 'manual', message: 'Перевірте брутто та тару' });
    } else {
      clearErrors(['weightNetto']);
    }
  };

  const selectAllOnFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.select();
  };

  const crops = useAppSelector(selectCrops());
  const locations = useAppSelector(selectLocations());
  const machines = useAppSelector(selectMachines());
  const operators = useAppSelector(selectOperators());

  const selectedDeliveryOperator = watch('deliveryOperator');
  const selectedHarvesterOperator = watch('harvesterOperator');

  useEffect(() => {
    if (
      selectedDeliveryOperator &&
      selectedDeliveryOperator === getValues('harvesterOperator') &&
      selectedDeliveryOperator !== ''
    ) {
      setValue('harvesterOperator', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeliveryOperator]);

  useEffect(() => {
    if (
      selectedHarvesterOperator &&
      selectedHarvesterOperator === getValues('deliveryOperator') &&
      selectedHarvesterOperator !== ''
    ) {
      setValue('deliveryOperator', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHarvesterOperator]);

  return (
    <Container maxWidth="xl" disableGutters>
      <Card component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, width: '100%' }}>
        <Grid container spacing={2} columns={12}>
          <Grid size={4}>
            <Controller
              name="crop"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={crops}
                  getOptionLabel={(option) => option.name}
                  value={crops.find((c) => c.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={formatMessage({ id: 'resource.crop.label' })}
                      error={!!errors.crop}
                      helperText={errors.crop?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="sourceLocation"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={locations.filter((l) => l.isSource)}
                  getOptionLabel={(option) => option.name}
                  value={locations.find((l) => l.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={formatMessage({ id: 'resource.location.columns.source' })}
                      error={!!errors.sourceLocation}
                      helperText={errors.sourceLocation?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="destinationLocation"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={locations.filter((l) => l.isDestination)}
                  getOptionLabel={(option) => option.name}
                  value={locations.find((l) => l.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={formatMessage({ id: 'resource.location.columns.destination' })}
                      error={!!errors.destinationLocation}
                      helperText={errors.destinationLocation?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />
          </Grid>

          <Grid size={6}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Controller
                  name="deliveryMachine"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      size="small"
                      options={machines
                        .filter((l) => l.canDeliver)
                        .map(({ id, licensePlate, description, make, model }) => ({
                          id,
                          name: `[${licensePlate}] ${make}, ${model} (${description})`,
                        }))}
                      getOptionLabel={(option) => option.name}
                      value={
                        machines
                          .filter((l) => l.canDeliver)
                          .map(({ id, licensePlate, description, make, model }) => ({
                            id,
                            name: `[${licensePlate}] ${make}, ${model} (${description})`,
                          }))
                          .find((m) => m.id === field.value) || null
                      }
                      onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={formatMessage({ id: 'weighing_entry_form.delivery_machine' })}
                          error={!!errors.deliveryMachine}
                          helperText={errors.deliveryMachine?.message}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="deliveryOperator"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      size="small"
                      options={operators.filter((op) => op.id !== selectedHarvesterOperator)}
                      getOptionLabel={(option) => option.name}
                      value={operators.find((o) => o.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={formatMessage({ id: 'weighing_entry_form.delivery_operator' })}
                          error={!!errors.deliveryOperator}
                          helperText={errors.deliveryOperator?.message}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={6}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Controller
                  name="harvesterMachine"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      size="small"
                      options={machines
                        .filter((l) => l.canHarvest)
                        .map(({ id, licensePlate, description, make, model }) => ({
                          id,
                          name: `[${licensePlate}] ${make}, ${model} (${description})`,
                        }))}
                      getOptionLabel={(option) => option.name}
                      value={
                        machines
                          .filter((l) => l.canHarvest)
                          .map(({ id, licensePlate, description, make, model }) => ({
                            id,
                            name: `[${licensePlate}] ${make}, ${model} (${description})`,
                          }))
                          .find((m) => m.id === field.value) || null
                      }
                      onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={formatMessage({ id: 'weighing_entry_form.harvest_machine' })}
                          error={!!errors.harvesterMachine}
                          helperText={errors.harvesterMachine?.message}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="harvesterOperator"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      size="small"
                      options={operators.filter((op) => op.id !== selectedDeliveryOperator)}
                      getOptionLabel={(option) => option.name}
                      value={operators.find((o) => o.id === field.value) || null}
                      onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={formatMessage({ id: 'weighing_entry_form.harvest_operator' })}
                          error={!!errors.harvesterOperator}
                          helperText={errors.harvesterOperator?.message}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={9}>
            <Grid container spacing={2}>
              <Grid size={4}>
                <Controller
                  name="weightGross"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={formatMessage({ id: 'weighing_entry_form.weight.brutto' })}
                      size="small"
                      type="number"
                      error={!!errors.weightGross}
                      helperText={errors.weightGross?.message}
                      fullWidth
                      onBlur={onCalculateNetto}
                      onFocus={selectAllOnFocus}
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="weightTare"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={formatMessage({ id: 'weighing_entry_form.weight.tare' })}
                      size="small"
                      type="number"
                      error={!!errors.weightTare}
                      helperText={errors.weightTare?.message}
                      fullWidth
                      onBlur={onCalculateNetto}
                      onFocus={selectAllOnFocus}
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  name="weightNetto"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={formatMessage({ id: 'weighing_entry_form.weight.netto' })}
                      size="small"
                      type="number"
                      error={!!errors.weightNetto}
                      helperText={errors.weightNetto?.message}
                      fullWidth
                      disabled
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={3}>
            <Button variant="contained" color="primary" sx={{ mb: 2, height: 40 }} fullWidth type="submit">
              {formatMessage({ id: 'weighing_entry_form.submit_button' })}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
