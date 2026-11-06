import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api/base-api';
import { cartReducer } from '@/entities/cart';
import { sessionReducer } from '@/entities/user';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    cart: cartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
