import { IApplicationService } from "../../../../src/core/application/application-service/application.service.interface";
import { RepositoryPagingDto } from "../../../../src/core/application/repositories/repository-paging.dto";
import { Result } from "../../../../src/core/application/result-handler/result";
import { DoctorId } from "../../../../src/doctor/domain/value-objects/doctor-id";
import { IMedicalRecordRepository } from "../../../../src/medical-record/application/repositories/medical-record.repository.interface";
import { MedicalRecord } from "../../../../src/medical-record/domain/medical-record";

//#region Service DTOs
export interface SearchDoctorMedicalRecordsApplicationServiceDto {
    id?: string;
    paging?: RepositoryPagingDto;
}
//#endregion

export class SearchDoctorMedicalRecordsApplicationService implements IApplicationService<SearchDoctorMedicalRecordsApplicationServiceDto, MedicalRecord[]>{

    get name(): string { return this.constructor.name; }

    constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) { }

    async execute(dto: SearchDoctorMedicalRecordsApplicationServiceDto): Promise<Result<MedicalRecord[]>> {
        
        const medicalRecords = await this.medicalRecordRepository.findMedicalRecordByDoctor(DoctorId.create(dto.id), dto.paging);

        return Result.success(medicalRecords);
    }
}