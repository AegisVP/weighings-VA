import z from 'zod';
import { useRef, useEffect } from 'react';
import type { FocusEvent } from 'react';
import { Button, Card, Container, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppSelector } from '../../redux/hooks';
import { selectCrop, selectLocation, selectMachine, selectOperator } from '../../redux/resources/resourcesSelectors';
import { SelectFormControl } from '../FormElements/SelectFormControl';

import type { Resolver, SubmitHandler } from 'react-hook-form';
import type { TypeCropSchema, TypeLocationSchema, TypeMachineSchema, TypeOperatorSchema } from '../../redux/types';

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
  weightNetto: z.coerce.number().min(10, 'Перевірте брутто та тару'),
  dateTime: z.date(),
});
export type TypeWeighingInput = z.infer<typeof weighingInputSchema>;

export const WeighingEntryForm = () => {
  const defaultValues = useRef<TypeWeighingInput>({
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
    dateTime: new Date(),
  }).current;

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

  // select all text when an input receives focus
  const selectAllOnFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // e.target is an HTML input or textarea — select its content
    e.target.select();
  };

  const onSubmit: SubmitHandler<TypeWeighingInput> = (data) => {
    console.log('Weighing Entry Submitted:', data);
  };

  const crops = useAppSelector(selectCrop);
  const locations = useAppSelector(selectLocation);
  const machines = useAppSelector(selectMachine);
  const operators = useAppSelector(selectOperator);

  // watch selected operators so we can exclude one from the other's list
  const selectedDeliveryOperator = watch('deliveryOperator');
  const selectedHarvesterOperator = watch('harvesterOperator');

  // if user selects the same operator for both roles, clear the other role
  // keep fields as empty string when cleared to satisfy zod uuid() validation later
  // (we only clear when a conflict is detected)
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
                <SelectFormControl<TypeCropSchema, 'crop'>
                  error={errors.crop}
                  label="Культура"
                  field={field}
                  items={crops.items}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="sourceLocation"
              control={control}
              render={({ field }) => (
                <SelectFormControl<TypeLocationSchema, 'sourceLocation'>
                  error={errors.sourceLocation}
                  label="Джерело"
                  field={field}
                  items={locations.items.filter((l) => l.isSource)}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Controller
              name="destinationLocation"
              control={control}
              render={({ field }) => (
                <SelectFormControl<TypeLocationSchema, 'destinationLocation'>
                  error={errors.destinationLocation}
                  label="Місце призначення"
                  field={field}
                  items={locations.items.filter((l) => l.isDestination)}
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
                    <SelectFormControl<TypeMachineSchema, 'deliveryMachine'>
                      error={errors.deliveryMachine}
                      label="Привіз"
                      field={field}
                      items={machines.items
                        .filter((l) => l.canDeliver)
                        .map(({ id, licensePlate, description, make, model }) => ({
                          id,
                          name: `[${licensePlate}] ${make}, ${model} (${description})`,
                        }))}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="deliveryOperator"
                  control={control}
                  render={({ field }) => (
                    <SelectFormControl<TypeOperatorSchema, 'deliveryOperator'>
                      error={errors.deliveryOperator}
                      label="Водій"
                      field={field}
                      items={operators.items.filter((op) => op.id !== selectedHarvesterOperator)}
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
                    <SelectFormControl<TypeMachineSchema, 'harvesterMachine'>
                      error={errors.harvesterMachine}
                      label="Зібрав"
                      field={field}
                      items={machines.items
                        .filter((l) => l.canHarvest)
                        .map(({ id, licensePlate, description, make, model }) => ({
                          id,
                          name: `[${licensePlate}] ${make}, ${model} (${description})`,
                        }))}
                    />
                  )}
                />
              </Grid>
              <Grid size={6}>
                <Controller
                  name="harvesterOperator"
                  control={control}
                  render={({ field }) => (
                    <SelectFormControl<TypeOperatorSchema, 'harvesterOperator'>
                      error={errors.harvesterOperator}
                      label="Комбайнер"
                      field={field}
                      items={operators.items.filter((op) => op.id !== selectedDeliveryOperator)}
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
                      label="Вага (брутто)"
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
                      label="Вага (тара)"
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
                      label="Вага (нетто)"
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
            <Card title="Службове" sx={{ p: 2, width: '100%' }}>
              службова інформація
            </Card>
          </Grid>

          <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth type="submit">
            Зберегти
          </Button>
        </Grid>
      </Card>
    </Container>
  );
};
