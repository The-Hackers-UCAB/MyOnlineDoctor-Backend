import { IApplicationService } from "../../../core/application/application-service/application-service.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Result } from "../../../core/application/result-handler/result";
import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { Appointment } from "../../../appointment/domain/appointment";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";

//#region Service DTOs
export interface SearchDoctorAppointmentsApplicationServiceRequest {
    id?: string;
    paging?: RepositoryPagingDto;
}
//#endregion

export class SearchDoctorAppointmentsApplicationService implements IApplicationService<SearchDoctorAppointmentsApplicationServiceRequest, Appointment[]> {
    get name(): string { return this.constructor.name; }

    constructor(private readonly appointmentRepository: IAppointmentRepository) { }

    async execute(dto: SearchDoctorAppointmentsApplicationServiceRequest): Promise<Result<Appointment[]>> {
        const appointments = await this.appointmentRepository.findDoctorAppointments(DoctorId.create(dto.id), dto.paging);
        
        return Result.success(appointments);
    }
}
