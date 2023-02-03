import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { constants } from 'constants';

export const constantsApi = createApi({
  reducerPath: 'constants',
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.BASE_URL}/api/constants`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: build => ({
    getConstant: build.query({
      query: constant => ({ url: `/${constant}` }),
      // transformResponse: (ret, meta, arg) => {      },
    }),
  }),
});

export const { useGetConstantQuery } = constantsApi;
