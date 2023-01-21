import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { constants } from 'constants';

// export const constantsApi = createApi({
//   reducerPath: 'constants',
//   tagTypes: ['constant'],
//   keepUnusedDataFor: 60,
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${constants.BASE_URL}/api/constants`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().user.token;
//       if (token) headers.set('authorization', `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   endpoints: builder => ({
//     getConstant: builder.query({
//       query: constant => `/${constant}`,
//     }),
//   }),
// });

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
  tagTypes: ['Constant'],
  endpoints: build => ({
    getConstant: build.query({
      query: constant => ({ url: `/${constant}` }),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      // transformErrorResponse: (response, meta, arg) => response.status,
      providesTags: (result, error, id) => ['Constant'],
    }),
  }),
});

export const { useGetConstantQuery } = constantsApi;
