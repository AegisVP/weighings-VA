import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { date2Obj } from 'utils';
import { constants } from 'constants';

export const weighingsApi = createApi({
  reducerPath: 'weighings',
  tagTypes: ['Weighing'],
  keepUnusedDataFor: 60,
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.BASE_URL}/api/weighings`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    getWeighings: builder.query({
      providesTags: ['Weighing'],
      query: (inputSearchParams = date2Obj()) => ({
        url: `/?${new URLSearchParams(inputSearchParams).toString()}`,
        method: 'GET',
      }),
    }),
    addWeighing: builder.mutation({
      query: weighing => ({ url: '/', method: 'POST', body: weighing }),
    }),
  }),
});

export const { useGetWeighingsQuery, useAddWeighingMutation } = weighingsApi;
