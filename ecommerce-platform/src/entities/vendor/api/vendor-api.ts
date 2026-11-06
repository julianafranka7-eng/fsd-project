import { baseApi } from '@/shared/api/base-api';
import type { Vendor } from '@/shared/types';

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], void>({
      query: () => '/vendors',
      providesTags: ['Vendor'],
    }),
    getVendorById: builder.query<Vendor, string>({
      query: (id) => `/vendors/${id}`,
      providesTags: ['Vendor'],
    }),
    updateVendorStatus: builder.mutation<Vendor, { id: string; status: Vendor['status'] }>({
      query: ({ id, status }) => ({ url: `/vendors/${id}`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Vendor'],
    }),
  }),
});

export const { useGetVendorsQuery, useGetVendorByIdQuery, useUpdateVendorStatusMutation } = vendorApi;
