import { IApplicationService } from "../../../core/application/application-service/application-service.interface";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Result } from "../../../core/application/result-handler/result";
import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { Appointment } from "../../../appointment/domain/appointment";

//#region Service DTOs
export interface SearchPatientAppointmentsApplicationServiceRequest {
    id?: string;
    paging?: RepositoryPagingDto;
}
//#endregion

export class SearchPatientAppointmentsApplicationService implements IApplicationService<SearchPatientAppointmentsApplicationServiceRequest, Appointment[]> {
    get name(): string { return this.constructor.name; }

    constructor(private readonly appointmentRepository: IAppointmentRepository) { }

    async execute(dto: SearchPatientAppointmentsApplicationServiceRequest): Promise<Result<Appointment[]>> {

        const appointments = await this.appointmentRepository.findPatientAppointments(PatientId.create(dto.id), dto.paging);

        return Result.success(appointments);
    }
}
