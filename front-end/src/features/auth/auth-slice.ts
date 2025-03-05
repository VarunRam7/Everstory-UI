import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.setItem('accessToken', '');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
