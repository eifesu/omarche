import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Admin } from '../api/auth';

export type AuthStateType = {
  user: Admin | undefined; // Replace with proper user type when available
  role: "Client" | "Agent" | "Livreur";
  token: string;
};

const initialState: AuthStateType = {
  user: undefined,
  role: "Client",
  token: "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeRole: (state, action: PayloadAction<AuthStateType["role"]>) => {
      state.role = action.payload;
    },
    logIn: (state, action: PayloadAction<Omit<AuthStateType, "role">>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.user = undefined;
      state.role = "Client";
      state.token = "";
    },
  },
});

export const { changeRole, logIn, logOut } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthStateType }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthStateType }) => state.auth.token;
export const selectCurrentRole = (state: { auth: AuthStateType }) => state.auth.role;
