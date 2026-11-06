import { baseApi } from '@/shared/api/base-api';
import type { Product } from '@/shared/types';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { categoryId?: string; vendorId?: string; search?: string } | void>({
      query: (params) => ({ url: '/products', params: params ?? undefined }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string; changes: Partial<Product> }>({
      query: ({ id, changes }) => ({ url: `/products/${id}`, method: 'PATCH', body: changes }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
