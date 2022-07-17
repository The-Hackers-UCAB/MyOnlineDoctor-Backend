import { Appointment } from "../../../appointment/domain/appointment";
import { AppointmentDate } from "../../../appointment/domain/value-objects/appointment-date";
import { AppointmentDescription } from "../../../appointment/domain/value-objects/appointment-description";
import { AppointmentDoctor } from "../../../appointment/domain/value-objects/appointment-doctor";
import { AppointmentDuration } from "../../../appointment/domain/value-objects/appointment-duration";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { AppointmentPatient } from "../../../appointment/domain/value-objects/appointment-patient";
import { AppointmentStatus } from "../../../appointment/domain/value-objects/appointment-status";
import { AppointmentType } from "../../../appointment/domain/value-objects/appointment-type";
import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { IRepository } from "../../../core/application/repositories/repository.interface";

export class SearchAppointmentsByCriteriaDomainDto {
    date?: AppointmentDate;
    description?: AppointmentDescription;
    duration?: AppointmentDuration;
    status?: AppointmentStatus;
    type?: AppointmentType;
    patient?: AppointmentPatient;
    doctor?: AppointmentDoctor;
}

export interface IAppointmentRepository extends IRepository<AppointmentId, Appointment> {
    findAppointmentByCriterias(criterias: SearchAppointmentsByCriteriaDomainDto, options: RepositoryPagingDto): Promise<Appointment[]>
}