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
  tagTypes: ["Login", "Dashboard"],
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
    // getCustomers: build.query({
    //   query: () => "client/customers",
    //   providesTags: ["Customers"],
    // }),
    // getTransactions: build.query({
    //   query: ({ page, pageSize, sort, search }) => ({
    //     url: "client/transactions",
    //     method: "GET",
    //     params: { page, pageSize, sort, search },
    //   }),
    //   providesTags: ["Transactions"],
    // }),
    // getGeography: build.query({
    //   query: () => "client/geography",
    //   providesTags: ["Geography"],
    // }),
    // getSales: build.query({
    //   query: () => "sales/sales",
    //   providesTags: ["Sales"],
    // }),
    // getAdmins: build.query({
    //   query: () => "management/admins",
    //   providesTags: ["Admins"],
    // }),
    // getLoginPerformance: build.query({
    //   query: (id) => `management/performance/${id}`,
    //   providesTags: ["Performance"],
    // }),
    // getDashboard: build.query({
    //   query: () => "general/dashboard",
    //   providesTags: ["Dashboard"],
    // }),
  }),
});

export const { useGetLoginQuery, useGetDashboardQuery } = api;
