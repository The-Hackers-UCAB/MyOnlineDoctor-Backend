import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Result } from "../../../core/application/result-handler/result";
import { IDoctorRepository } from "../repositories/doctor.repository.inteface";
import { Doctor } from "../../../doctor/domain/doctor";
import { DoctorId } from "../../domain/value-objects/doctor-id";

//#region Service DTOs
export interface GetDoctorProfileApplicationServiceDto {
    id?: string;
}
//#endregion

export class GetDoctorProfileApplicationService implements IApplicationService<GetDoctorProfileApplicationServiceDto, Doctor> {

    get name(): string { return this.constructor.name; }

    constructor(private readonly doctorRepository: IDoctorRepository) { }

    async execute(dto: GetDoctorProfileApplicationServiceDto): Promise<Result<Doctor>> {
        const doctor = await this.doctorRepository.findDoctorProfile(DoctorId.create(dto.id));

        return Result.success(doctor);
    }
}
