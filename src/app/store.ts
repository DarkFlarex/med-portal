import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import { clinicsReducer } from "../features/MedicalFacility/clinicsSlice";
import { misServerApi } from "./api/search"; // <-- импортируем наш RTK Query API

// комбинируем редьюсеры
const rootReducer = combineReducers({
  clinics: clinicsReducer,
  [misServerApi.reducerPath]: misServerApi.reducer, // <-- добавляем редьюсер RTK Query
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(misServerApi.middleware),
});

export const persistor = persistStore(store);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
