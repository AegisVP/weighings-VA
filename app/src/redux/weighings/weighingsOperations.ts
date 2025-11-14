import axios from 'axios';
import z from 'zod';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { handleError } from '../../utils/handleError';
import { weighingApiResponseSchema } from '../../schema/weighingSchema';

import type { TypeAddPayload, TypeThunkApiConfig } from '../resources/resourcesOperations';
import type { TypeWeighingSchema } from '../types';

type TypeWeighingSearch = Partial<
  Omit<TypeWeighingSchema, 'dateTime' | 'weightNetto'> & {
    startDate: string;
    endDate: string;
  }
>;
export type TypeWeighingApiResponse = z.infer<typeof weighingApiResponseSchema>;

export const addWeighing = createAsyncThunk<TypeWeighingSchema, TypeAddPayload<TypeWeighingSchema>, TypeThunkApiConfig>(
  'weighings/add',
  async (weighing, { rejectWithValue, getState }) => {
    try {
      const user = getState().auth.user;
      const weighingData = {
        source: weighing.sourceLocation,
        destination: weighing.destinationLocation,
        auto: weighing.deliveryMachine,
        driver: weighing.deliveryOperator,
        harvester: weighing.harvesterMachine,
        operator: weighing.harvesterOperator,
        crop: weighing.crop,
        weight: weighing.weightNetto,
        createdBy: user.username,
      };

      return (await axios.post('/weighings', weighingData)).data;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);

export const searchWeighing = createAsyncThunk<TypeWeighingSchema[], TypeWeighingSearch, TypeThunkApiConfig>(
  'weighings/search',
  async (query, { rejectWithValue }) => {
    try {
      const queryParams: Record<string, string> = {};

      if (query?.sourceLocation) queryParams.sourceId = query.sourceLocation;
      if (query?.destinationLocation) queryParams.destinationId = query.destinationLocation;
      if (query?.deliveryMachine) queryParams.deliveryMachineId = query.deliveryMachine;
      if (query?.deliveryOperator) queryParams.deliveryOperatorId = query.deliveryOperator;
      if (query?.harvesterMachine) queryParams.harvesterMachineId = query.harvesterMachine;
      if (query?.harvesterOperator) queryParams.harvesterOperatorId = query.harvesterOperator;
      if (query?.crop) queryParams.cropId = query.crop;
      if (query?.startDate) queryParams.startDate = query.startDate;
      if (query?.endDate) queryParams.endDate = query.endDate;

      const weighings = (await axios.get<TypeWeighingApiResponse>('/weighings', { params: queryParams })).data;
      const mappedWeighings: TypeWeighingSchema[] = weighings.items.map((response) => ({
        sourceLocation: response.source,
        destinationLocation: response.destination,
        deliveryMachine: response.auto,
        deliveryOperator: response.driver,
        harvesterMachine: response.harvester,
        harvesterOperator: response.operator,
        crop: response.crop,
        weightNetto: response.weight,
        dateTime: response.createdAt,
      }));

      return mappedWeighings;
    } catch (err) {
      return rejectWithValue(handleError(err));
    }
  }
);
