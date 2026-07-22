// store/api/misServerApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../constants.ts";

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
  duration_priem_min: number;
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

export interface Service {
  codeid: number;
  codeid_department: number;
  name: string;
  comment: string | null;
  cost: number;
  status: number;
  type: number | null;
  header: string | null;
  sort: number | null;
  device: string | null;
}

export interface GetServicesRequest {
  departmentId?: number;
  search_val?: string;
}

export interface BookPatientRequest {
  code_department: number;
  code_dep_service: number;
  event_start: string;
  event_end?: string;
  fullname?: string;
  phone: string;
  dob?: string;
  comments?: string;
  discount?: number;
  registrator?: string;
}

export interface BookPatientResponse {
  success: boolean;
  message: string;
  event_id?: number;
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

export interface ServiceItem {
  id: number;
  name: string;
  comment: string | null;
  cost: number;
  status: number;
  type: number | null;
  header: string | null;
  device: string | null;
  sort: number | null;
}

export interface DepartmentWithServices {
  id: number;
  name: string;
  status: number;
  color: string | null;
  type: number | null;
  code_clinic: number | null;
  range: number | null;
  services: ServiceItem[];
}

export interface DepartmentsWithServicesResponse {
  success: boolean;
  data: DepartmentWithServices[];
}

// ====================== API ======================
export const misServerApi = createApi({
  reducerPath: "misServerApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // <-- поменяй на свой бекенд
  endpoints: (builder) => ({
    // поиск докторов
    searchDoctors: builder.query({
      query: (params) => ({
        url: "api/searchDoctors",
        params,
      }),
    }),

    clinics: builder.query({
      query: () => ({
        url: "api/clinics",
        method: "GET",
      }),
    }),

    getDepartments: builder.query({
      query: (params) => ({
        url: "api/departments",
        method: "GET",
        params,
      }),
    }),

    // отделения вместе со своими услугами (для группировки в один запрос)
    getDepartmentsWithServices: builder.query<
      DepartmentsWithServicesResponse,
      void
    >({
      query: () => ({
        url: "api/departments-with-services",
        method: "GET",
      }),
    }),

    // получение событий
    getEvents: builder.query({
      query: (params) => ({
        url: "/api/get_events",
        method: "GET",
        params,
      }),
    }),

    // создание/обновление события
    upsertEvent: builder.mutation({
      query: (body) => ({
        url: "upsert_event",
        method: "POST",
        body,
      }),
    }),

    getServices: builder.query<Service[], GetServicesRequest>({
      query: (params) => ({
        url: "api/get-services",
        method: "GET",
        params,
      }),
    }),

    // запись пациента на услугу (врач фиксирован на бэкенде)
    bookPatient: builder.mutation<BookPatientResponse, BookPatientRequest>({
      query: (params) => ({
        url: "api/book-patient",
        method: "POST",
        body: params,
      }),
    }),

    // проверка пароля
    checkPassword: builder.mutation({
      query: (body) => ({
        url: "check_password",
        method: "POST",
        body,
      }),
    }),

    // обновление online_regis доктора
    updateDoctorOnline: builder.mutation({
      query: (body) => ({
        url: "update_doctor_online",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSearchDoctorsQuery,
  useClinicsQuery,
  useGetDepartmentsQuery,
  useGetEventsQuery,
  useUpsertEventMutation,
  useCheckPasswordMutation,
  useUpdateDoctorOnlineMutation,
  useGetServicesQuery,
  useBookPatientMutation,
  useGetDepartmentsWithServicesQuery,
} = misServerApi;
