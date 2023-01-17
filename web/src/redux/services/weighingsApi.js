import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { constants } from 'constants';

export const weighingsApi = createApi({
  reducerPath: 'weighings',
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.BASE_URL}/api/weighings`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    getWeighings: builder.query({
      query: UrlSearchParams => ({ url: `/?${UrlSearchParams.toString}`, method: 'GET' }),
    }),
    addWeighing: builder.mutation({
      query: weighing => ({ url: '/', method: 'POST', body: weighing }),
    }),
  }),
});

export const { useGetWeighingsQuery, useAddWeighingMutation } = weighingsApi;
