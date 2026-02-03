// store/api/misServerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {API_URL} from "../../constants.ts";

// Типы для докторов
export interface Doctor {
  doctor_id: number;
  fio: string;
  department_id: number;
  department_name: string;
  service_name: string;
  price: number;
  online_regis: number;
  img: string;
  monday_start: string | null;
  monday_end: string | null;
  tuesday_start: string | null;
  tuesday_end: string | null;
  wednesday_start: string | null;
  wednesday_end: string | null;
  thursday_start: string | null;
  thursday_end: string | null;
  friday_start: string | null;
  friday_end: string | null;
  saturday_start: string | null;
  saturday_end: string | null;
  sunday_start: string | null;
  sunday_end: string | null;
}

export interface Clinic {
  codeid: string;
  name: string;
  status: number;
  file_name: string | null;
}

export interface Department {
  codeid: number;
  name: string;
}

export interface SearchResponse {
  doctors_list: Doctor[];
  clinics: Clinic[];
  departaments: Department[];
}

export interface SearchRequest {
  departmentId?: number;
  clinicId?: number;
  search_val?: string;
  arr_status?: number[] | number;
  perm?: number;
}

export interface Event {
  event_start: string;
  event_end: string;
}

export interface GetEventsRequest {
  doctorId?: number;
  selectedDate?: string;
  end_date?: string;
}

export interface UpsertEventRequest {
  department_id?: number;
  code_doctor?: number;
  event_start: string;
  event_end?: string;
  date_system?: string;
  fullname?: string;
  phone?: string;
  dob?: string;
  comments?: string;
}

export interface UpdateDoctorRequest {
  doctorId: number;
  online_regis: number;
}

// ====================== API ======================
export const misServerApi = createApi({
  reducerPath: "misServerApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // <-- поменяй на свой бекенд
  endpoints: (builder) => ({
    // поиск докторов
    searchDoctors: builder.mutation<SearchResponse, SearchRequest>({
      query: (body) => ({
        url: "search",
        method: "POST",
        body,
      }),
    }),

    // получение событий
    getEvents: builder.mutation<{ event_list: Event[] }, GetEventsRequest>({
      query: (body) => ({
        url: "get_events",
        method: "POST",
        body,
      }),
    }),

    // создание/обновление события
    upsertEvent: builder.mutation<
      { success: boolean; message: string },
      UpsertEventRequest
    >({
      query: (body) => ({
        url: "upsert_event",
        method: "POST",
        body,
      }),
    }),

    // проверка пароля
    checkPassword: builder.mutation<{ success: boolean }, { password: string }>(
      {
        query: (body) => ({
          url: "check_password",
          method: "POST",
          body,
        }),
      }
    ),

    // обновление online_regis доктора
    updateDoctorOnline: builder.mutation<
      { success: boolean; message: string },
      UpdateDoctorRequest
    >({
      query: (body) => ({
        url: "update_doctor_online",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSearchDoctorsMutation,
  useGetEventsMutation,
  useUpsertEventMutation,
  useCheckPasswordMutation,
  useUpdateDoctorOnlineMutation,
} = misServerApi;
