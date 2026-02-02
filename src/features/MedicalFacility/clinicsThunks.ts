import { createAsyncThunk } from "@reduxjs/toolkit";
import type {ClinicsResponse} from "../../types/types.ts";
import AxiosApi from "../../axiosApi.ts";

export const fetchClinics = createAsyncThunk(
    "clinics/fetchAll",
    async () => {
        const response = await AxiosApi.post<ClinicsResponse>(
            "https://new-kroha.333.kg/search",
            {
                date_from: "29.07.2025",
                date_to: "29.07.2025",
                search_val: "",
            }
        );

        return response.data.clinics || [];
    }
);
