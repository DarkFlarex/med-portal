export interface Clinic {
    codeid: string;
    name: string;
    address?: string;
}

export interface ClinicsResponse {
    clinics: Clinic[];
}
