import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./auth.types";
import type { RootState } from "@/store";

export const selectUser = (s: RootState) => s.auth.user;
export const selectIsAuthed = (s: RootState) => s.auth.isAuthed;

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthed: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthed: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user?: User | null }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user !== undefined) state.user = action.payload.user;
      state.isAuthed = !!state.accessToken;
    },
    setMe: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    signOut: () => initialState,
  },
});

export const { setCredentials, setMe, signOut } = authSlice.actions;
export default authSlice.reducer;
