import { Patient } from "../../../patient/domain/patient";
import { IApplicationService } from "../../../core/application/application-service/application-service.interface";
import { IPatientRepository, SearchAssociatedPatientsDomainDto } from "../repositories/patient.repository.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { PatientNames } from "../../../patient/domain/value-objects/patient-names";
import { PatientSurnames } from "../../../patient/domain/value-objects/patient-surnames";
import { PatientAllergies } from "../../../patient/domain/value-objects/patient-allergies";
import { PatientBackground } from "../../../patient/domain/value-objects/patient-background";
import { PatientBirthdate } from "../../../patient/domain/value-objects/patient-birthdate";
import { PatientHeight } from "../../../patient/domain/value-objects/patient-height";
import { PatientPhoneNumber } from "../../../patient/domain/value-objects/patient-phone-number";
import { PatientStatus } from "../../../patient/domain/value-objects/patient-status";
import { PatientWeight } from "../../../patient/domain/value-objects/patient-weight";
import { PatientSurgeries } from "../../../patient/domain/value-objects/patient-surgeries";
import { PatientGender } from "../../../patient/domain/value-objects/patient-gender";
import { Result } from "../../../core/application/result-handler/result";


export interface SearchAssociatedPatientsApplicationServiceRequest {
    firstName? : string;
    middleName? : string;
    firstSurname? : string;
    secondSurname? : string;
    allergies? : string;
    background? : string;
    birthdate? : Date;
    height? : number;
    phoneNumber? : string;
    status? : PatientStatus;
    weight? : number;
    surgeries? : string;
    gender? : PatientGender;
    paging? : RepositoryPagingDto;

}

export class SearchAssociatedPatientsApplicationService implements IApplicationService<SearchAssociatedPatientsApplicationServiceRequest, Patient[]>{

    get name() : string { return this.constructor.name; }

    constructor(private patientRepository: IPatientRepository) { }

    async execute(dto: SearchAssociatedPatientsApplicationServiceRequest): Promise<Result<Patient[]>> {
        const associated: SearchAssociatedPatientsDomainDto = {};
        if (dto.firstName) { associated.names = PatientNames.create(dto.firstName,dto.middleName); }
        if (dto.firstSurname) { associated.surnames = PatientSurnames.create(dto.firstSurname,dto.secondSurname); }
        if (dto.allergies) { associated.allergies = PatientAllergies.create(dto.allergies); }
        if (dto.background) { associated.background = PatientBackground.create(dto.background); }
        if (dto.birthdate) { associated.birthdate = PatientBirthdate.create(dto.birthdate); }
        if (dto.height) { associated.height = PatientHeight.create(dto.height); }
        if (dto.phoneNumber) { associated.phoneNumber = PatientPhoneNumber.create(dto.phoneNumber); }
        if (dto.status) { associated.status = PatientStatus.ACTIVE; }
        if (dto.weight) { associated.weight = PatientWeight.create(dto.weight); }
        if (dto.surgeries) { associated.surgeries = PatientSurgeries.create(dto.surgeries); }

        //Realiza la busqueda de los pacientes asociados al doctor
        const patients = await this.patientRepository.findAsociatedPatients(associated, dto.paging);
        return Result.success(patients);

    }
}