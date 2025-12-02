import z from 'zod';
import { useIntl } from 'react-intl';
import { useEffect, useState, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { handleError } from '../../utils/handleError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectCrops,
  selectLocations,
  selectMachines,
  selectOperators,
} from '../../redux/resources/resourcesSelectors';
import { selectUserInfo } from '../../redux/user/userSelectors';
import { addWeighing } from '../../redux/weighings/weighingsOperations';
import { editWeighingInProgress, removeWeighingInProgress } from '../../redux/weighings/weighingsSlice';

import type { FocusEvent } from 'react';
import type { ControllerRenderProps, Resolver, SubmitHandler } from 'react-hook-form';
import type { TypeMachineSchema } from '../../redux/types';

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

const SHOW_DELETE_BUTTON_DELAY = 5000;

type WeighingEntryFormProps = {
  dateTime: string;
  defaultValues: TypeWeighingInput;
  setDefaultValues: (data: TypeWeighingInput) => void;
};
export const WeighingEntryForm = ({ dateTime, defaultValues, setDefaultValues }: WeighingEntryFormProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const showDeleteButtonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    defaultValues: { ...defaultValues, dateTime },
  });

  const { username } = useAppSelector(selectUserInfo);
  const deliveryMachine = watch('deliveryMachine');
  const harvesterMachine = watch('harvesterMachine');
  const deliveredByHarvester = deliveryMachine === harvesterMachine;
  console.log({ deliveryMachine, harvesterMachine, deliveredByHarvester });

  const onCalculateNetto = () => {
    const gross = getValues('weightGross') || 0;
    const tare = getValues('weightTare') || 0;
    const netto = gross - tare >= 0 ? gross - tare : 0;

    setValue('weightNetto', netto);
    dispatch(editWeighingInProgress({ ...getValues(), weightNetto: netto, weightGross: gross, weightTare: tare }));

    if (netto <= 0) {
      setError('weightNetto', { type: 'manual', message: 'Перевірте брутто та тару' });
    } else {
      clearErrors(['weightNetto']);
    }
  };

  const onSubmit: SubmitHandler<TypeWeighingInput> = async (data) => {
    setApiError('');
    setIsLoading(true);
    setDefaultValues(data);

    try {
      await dispatch(addWeighing({ ...data, createdBy: username })).unwrap();
      dispatch(removeWeighingInProgress(dateTime));
    } catch (error) {
      setApiError(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveWeighingInProgress = () => {
    dispatch(removeWeighingInProgress(dateTime));
  };

  const handleChange =
    (field: ControllerRenderProps<TypeWeighingInput>) =>
    async (_: React.SyntheticEvent, value: Record<string, string | boolean | number> | null): Promise<void> => {
      const valueStr = value ? value.id : '';
      const payload = { ...getValues(), [field.name]: valueStr };
      if (['crop', 'sourceLocation', 'destinationLocation'].includes(field.name)) {
        setDefaultValues(payload);
      }
      dispatch(editWeighingInProgress(payload));
      return field.onChange(valueStr);
    };

  const selectAllOnFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.select();
  };

  const handleMouseEnter = () => {
    showDeleteButtonTimeoutRef.current = setTimeout(() => {
      setShowDeleteButton(true);
    }, SHOW_DELETE_BUTTON_DELAY);
  };

  const handleMouseLeave = () => {
    if (showDeleteButtonTimeoutRef.current) {
      clearTimeout(showDeleteButtonTimeoutRef.current);
      showDeleteButtonTimeoutRef.current = null;
    }
    setShowDeleteButton(false);
  };

  const crops = useAppSelector(selectCrops());
  const locations = useAppSelector(selectLocations());
  const machines = useAppSelector(selectMachines());
  const operators = useAppSelector(selectOperators());

  const selectedDeliveryOperator = watch('deliveryOperator');
  const selectedHarvesterOperator = watch('harvesterOperator');

  const mappedMachines = useMemo<(TypeMachineSchema & { name: string })[]>(
    () =>
      machines.map((m: TypeMachineSchema) => {
        const { licensePlate, make, model, description } = m;
        return { ...m, name: `[${licensePlate}] ${make}, ${model} (${description})` };
      }),
    [machines]
  );

  useEffect(() => {
    if (
      !deliveredByHarvester &&
      selectedDeliveryOperator &&
      selectedDeliveryOperator === getValues('harvesterOperator') &&
      selectedDeliveryOperator !== ''
    ) {
      setValue('harvesterOperator', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeliveryOperator, deliveredByHarvester]);

  useEffect(() => {
    if (
      !deliveredByHarvester &&
      selectedHarvesterOperator &&
      selectedHarvesterOperator === getValues('deliveryOperator') &&
      selectedHarvesterOperator !== ''
    ) {
      setValue('deliveryOperator', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHarvesterOperator, deliveredByHarvester]);

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
                  onChange={handleChange(field)}
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
                  onChange={handleChange(field)}
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
                  onChange={handleChange(field)}
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
                      options={mappedMachines.filter((l) => l.canDeliver)}
                      getOptionLabel={(option) => option.name}
                      value={mappedMachines.filter((l) => l.canDeliver).find((m) => m.id === field.value) || null}
                      onChange={handleChange(field)}
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
                      options={
                        deliveredByHarvester ? operators : operators.filter((op) => op.id !== selectedHarvesterOperator)
                      }
                      getOptionLabel={(option) => option.name}
                      value={operators.find((o) => o.id === field.value) || null}
                      onChange={handleChange(field)}
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
                      options={mappedMachines.filter((l) => l.canHarvest)}
                      getOptionLabel={(option) => option.name}
                      value={mappedMachines.filter((l) => l.canHarvest).find((m) => m.id === field.value) || null}
                      onChange={handleChange(field)}
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
                      options={
                        deliveredByHarvester ? operators : operators.filter((op) => op.id !== selectedDeliveryOperator)
                      }
                      getOptionLabel={(option) => option.name}
                      value={operators.find((o) => o.id === field.value) || null}
                      onChange={handleChange(field)}
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
          <Grid
            size={3}
            container
            columns={3}
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Grid size={showDeleteButton ? 2 : 3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ height: 40 }}
                fullWidth
                type="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                {formatMessage({ id: 'weighing_entry_form.submit_button' })}
              </Button>
            </Grid>
            {showDeleteButton ? (
              <Grid size={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ height: 40 }}
                  fullWidth
                  type="button"
                  onClick={handleRemoveWeighingInProgress}
                >
                  {formatMessage({ id: 'weighing_entry_form.close_button' })}
                </Button>
              </Grid>
            ) : null}
          </Grid>
          {apiError ? (
            <Grid size={12}>
              <Typography variant="subtitle2" color="error" textAlign="left" sx={{ my: 0, py: 0 }}>
                {apiError}
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Card>
    </Container>
  );
};
