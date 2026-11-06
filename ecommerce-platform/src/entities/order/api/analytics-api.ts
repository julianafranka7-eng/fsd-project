import { baseApi } from '@/shared/api/base-api';
import type { AnalyticsSummary } from '@/shared/types';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query<AnalyticsSummary, { vendorId?: string } | void>({
      query: (params) => ({ url: '/analytics/summary', params: params ?? undefined }),
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsSummaryQuery } = analyticsApi;
