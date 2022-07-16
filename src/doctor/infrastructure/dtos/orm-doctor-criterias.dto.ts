import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty.enum";

export interface OrmDoctorCriteriasDto {
    firstName?: string;
    middleName?: string;

    firstSurname?: string;
    secondSurname?: string;

    latitude?: number;
    longitude?: number;

    rating?: number;

    specialty?: DoctorSpecialty
}