import { IApplicationService } from "../../../../src/core/application/application-service/application.service.interface";
import { RepositoryPagingDto } from "../../../../src/core/application/repositories/repository-paging.dto";
import { Result } from "../../../../src/core/application/result-handler/result";
import { IMedicalRecordRepository } from "../../../../src/medical-record/application/repositories/medical-record.repository.interface";
import { MedicalRecord } from "../../../../src/medical-record/domain/medical-record";
import { PatientId } from "../../../../src/patient/domain/value-objects/patient-id";

//#region Service DTOs
export interface SearchPatientMedicalRecordsApplicationServiceDto {
    id?: string;
    paging?: RepositoryPagingDto;
}
//#endregion

export class SearchPatientMedicalRecordsApplicationService implements IApplicationService<SearchPatientMedicalRecordsApplicationServiceDto, MedicalRecord[]>{

    get name(): string { return this.constructor.name; }

    constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) { }

    async execute(dto: SearchPatientMedicalRecordsApplicationServiceDto): Promise<Result<MedicalRecord[]>> {

        const medicalRecords = await this.medicalRecordRepository.findMedicalRecordByPatient(PatientId.create(dto.id));

        return Result.success(medicalRecords);
    }
}