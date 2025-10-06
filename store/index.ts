import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@/services/baseApi";
import { baseRankApi } from "@/services/baseRankApi";
import authReducer from "@/features/auth/auth.slice";
import themeReducer from "@/features/ui/theme.slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [baseRankApi.reducerPath]: baseRankApi.reducer,
    auth: authReducer,
    theme: themeReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(baseApi.middleware).concat(baseRankApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
