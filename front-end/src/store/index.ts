import authReducer from '../features/auth/auth-slice';
import { configureStore } from '@reduxjs/toolkit';
import followRequestReducer from '../features/follow-request/follow-request-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    followRequests: followRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
