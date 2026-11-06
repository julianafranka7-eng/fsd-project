import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/shared/types';

interface SessionState {
  token: string | null;
  user: User | null;
}

const STORAGE_KEY = 'ecommerce_session';

const getInitialState = (): SessionState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse saved session', err);
  }
  return { token: null, user: null };
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
