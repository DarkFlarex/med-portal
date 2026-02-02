import {combineReducers, configureStore} from '@reduxjs/toolkit';

import {  FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from 'redux-persist';
import {clinicsReducer} from "../features/MedicalFacility/clinicsSlice.ts";


const rootReducer = combineReducers({
    clinics: clinicsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware:(getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck:{
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE,REGISTER],
      }
    });
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
