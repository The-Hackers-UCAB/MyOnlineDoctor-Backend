import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Result } from "../../../core/application/result-handler/result";
import { IPatientRepository } from "../../../patient/application/repositories/patient.repository.interface";
import { PatientId } from "../../domain/value-objects/patient-id";
import { Patient } from "../../../patient/domain/patient";

//#region Service DTOs
export interface GetPatientProfilesApplicationServiceDto {
    id?: string;
}
//#endregion

export class GetPatientProfilesApplicationService implements IApplicationService<GetPatientProfilesApplicationServiceDto, Patient> {
    get name(): string { return this.constructor.name; }

    constructor(private readonly patientRepository: IPatientRepository) { }

    async execute(dto: GetPatientProfilesApplicationServiceDto): Promise<Result<Patient>> {

        const patient = await this.patientRepository.findOneById(PatientId.create(dto.id));

        return Result.success(patient);
    }
}
