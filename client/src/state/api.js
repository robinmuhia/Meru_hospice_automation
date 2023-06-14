import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().global.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  reducerPath: "adminApi",
  tagTypes: ["Login", "Dashboard", "Notes"],
  endpoints: (build) => ({
    getLogin: build.query({
      query: (id) => `verifylogin/${id}`,
      providesTags: ["Login"],
    }),
    getDashboard: build.query({
      query: ({ page, pageSize, search, id }) => ({
        url: `dashboard/${id}`,
        method: "GET",
        params: { page, pageSize, search },
      }),
      providesTags: ["Dashboard"],
    }),
    getNotes: build.query({
      query: (id) => `notes/${id}`,
      providesTags: ["Notes"],
    }),
  }),
});

export const { useGetLoginQuery, useGetDashboardQuery, useGetNotesQuery } = api;
