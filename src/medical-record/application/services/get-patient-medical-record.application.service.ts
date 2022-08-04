import { MedicalRecord } from "../../../../src/medical-record/domain/medical-record";
import { IApplicationService } from "../../../../src/core/application/application-service/application.service.interface";
import { IMedicalRecordRepository } from "../repositories/medical-record.repository.interface";
import { DoctorId } from "../../../../src/doctor/domain/value-objects/doctor-id";
import { PatientId } from "../../../../src/patient/domain/value-objects/patient-id";
import { Result } from "../../../../src/core/application/result-handler/result";
import { RepositoryPagingDto } from "../../../../src/core/application/repositories/repository-paging.dto";

//#region Service DTOs
export interface GetPatientMedicalRecordApplicationServiceDto {
    patientId?: string,
    doctorId?: string,
    paging?: RepositoryPagingDto,
}
//#endregion

export class GetPatientMedicalRecordApplicationService implements IApplicationService<GetPatientMedicalRecordApplicationServiceDto, MedicalRecord[]>{

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly medicalRecordRepository: IMedicalRecordRepository,
    ) { }

    async execute(dto: GetPatientMedicalRecordApplicationServiceDto): Promise<Result<MedicalRecord[]>> {
        return Result.success(await this.medicalRecordRepository.findPatientMedicalRecordByDoctor(DoctorId.create(dto.doctorId), PatientId.create(dto.patientId), dto.paging));
    }
}