import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Result } from "../../../core/application/result-handler/result";
import { IPatientRepository } from "../repositories/patient.repository.interface";
import { Patient } from "../../../patient/domain/patient";
import { PatientId } from "../../domain/value-objects/patient-id";

//#region Service DTOs
export interface GetPatientProfileApplicationServiceDto {
    id?: string;
}
//#endregion

export class GetPatientProfileApplicationService implements IApplicationService<GetPatientProfileApplicationServiceDto, Patient> {

    get name(): string { return this.constructor.name; }

    constructor(private readonly patientRepository: IPatientRepository) { }

    async execute(dto: GetPatientProfileApplicationServiceDto): Promise<Result<Patient>> {
        const patient = await this.patientRepository.findPatientProfile(PatientId.create(dto.id));

        return Result.success(patient);
    }
}
