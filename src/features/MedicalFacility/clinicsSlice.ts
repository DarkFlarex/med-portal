import { createSlice } from "@reduxjs/toolkit";
import { fetchClinics } from "./clinicsThunks";
import type {Clinic} from "../../types/types.ts";

interface ClinicsState {
    items: Clinic[];
    loading: boolean;
}

const initialState: ClinicsState = {
    items: [],
    loading: false,
};

export const clinics = createSlice({
    name: "clinics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClinics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchClinics.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchClinics.rejected, (state) => {
                state.loading = false;
            });
    },
    selectors: {
        selectClinics: (state)=> state.items,
        selectClinicsFetching: (state)=> state.loading,
    }
});

export const clinicsReducer = clinics.reducer;

export const {
    selectClinics,
    selectClinicsFetching,
} = clinics.selectors;
