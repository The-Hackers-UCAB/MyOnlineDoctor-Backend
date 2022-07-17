import { PatientNames } from "../../../patient/domain/value-objects/patient-names";
import { PatientSurnames } from "../../../patient/domain/value-objects/patient-surnames";
import { PatientAllergies } from "../../../patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "../../../patient/domain/value-objects/patient-background";
import { PatientBirthdate } from "../../../patient/domain/value-objects/patient-birthdate";
import { PatientGender } from "../../../patient/domain/value-objects/patient-gender";
import { PatientHeight } from "../../../patient/domain/value-objects/patient-height";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { PatientPhoneNumber } from "../../../patient/domain/value-objects/patient-phone-number";
import { PatientStatus } from "../../../patient/domain/value-objects/patient-status";
import { PatientSurgeries } from "../../../patient/domain/value-objects/patient-surgeries";
import { PatientWeight } from "../../../patient/domain/value-objects/patient-weight";
import { IRepository } from "../../../core/application/repositories/repository.interface";
import { RepositoryPagingDto } from "src/core/application/repositories/repository-paging.dto";
import { Patient } from "../../../patient/domain/patient";

export class SearchAssociatedPatientsDomainDto {
    names?: PatientNames;
    surnames?: PatientSurnames;
    allergies?: PatientAllergies;
    background?: PatientBackground;
    birthdate?: PatientBirthdate;
    height?: PatientHeight;
    phoneNumber?: PatientPhoneNumber;
    status?: PatientStatus;
    weight?: PatientWeight;
    surgeries?: PatientSurgeries;
    gender?: PatientGender;
}

export interface IPatientRepository extends IRepository<PatientId, Patient> {

    findAsociatedPatients( asociated: SearchAssociatedPatientsDomainDto, options: RepositoryPagingDto ): Promise<Patient[]>;
}