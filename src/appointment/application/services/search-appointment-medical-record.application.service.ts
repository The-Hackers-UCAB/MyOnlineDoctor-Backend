import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { MedicalRecord } from "src/medical-record/domain/medical-record";
import { IMedicalRecordRepository } from "src/medical-record/application/repositories/medical-record.repository.interface";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";

//#region Service DTOs
export interface SearchAppointmentMedicalRecordApplicationServiceDto {
    id?: string;
}
//#endregion

export class SearchAppointmentMedicalRecordApplicationService implements IApplicationService<SearchAppointmentMedicalRecordApplicationServiceDto, MedicalRecord> {

    get name(): string { return this.constructor.name; }

    constructor(private readonly medicalRecordRepository: IMedicalRecordRepository) { }

    async execute(dto: SearchAppointmentMedicalRecordApplicationServiceDto): Promise<Result<MedicalRecord>> {
        const medicalRecord = await this.medicalRecordRepository.findMedicalRecordByAppointment(AppointmentId.create(dto.id));

        return Result.success(medicalRecord);
    }
}
