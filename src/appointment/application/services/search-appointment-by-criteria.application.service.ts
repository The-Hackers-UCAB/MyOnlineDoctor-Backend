import { Appointment } from "../../../appointment/domain/appointment";
import { IApplicationService } from "../../../core/application/application-service/application-service.interface";

import { RepositoryPagingDto } from "../../../core/application/repositories/repository-paging.dto";
import { Result } from "../../../core/application/result-handler/result";
import { AppointmentDate } from "../../../appointment/domain/value-objects/appointment-date";
import { AppointmentPatient } from "../../../appointment/domain/value-objects/appointment-patient";
import { IAppointmentRepository, SearchAppointmentsByCriteriaDomainDto } from "../repositories/appointment.repository.interface";
import { AppointmentStatusEnum } from "../../../appointment/domain/value-objects/appointment-status.enum";
import { AppointmentTypeEnum } from "../../../appointment/domain/value-objects/appointment-type.enum";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorSpecialtyEnum } from "../../../doctor/domain/value-objects/doctor-specialty.enum";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { AppointmentDescription } from "src/appointment/domain/value-objects/appointment-description";
import { AppointmentDuration } from "src/appointment/domain/value-objects/appointment-duration";
import { AppointmentType } from "src/appointment/domain/value-objects/appointment-type";
import { AppointmentStatus } from "src/appointment/domain/value-objects/appointment-status";
import { AppointmentDoctor } from "src/appointment/domain/value-objects/appointment-doctor";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";

//#region Service DTOs
export interface SearchAppointmentsByCriteriaApplicationServiceRequest {
    date?: Date;
    description?: string;
    duration?: number;
    status?: AppointmentStatusEnum;
    type?: AppointmentTypeEnum;
    patient?: PatientId;
    doctor?: DoctorId;
    doctorSpecialty?: DoctorSpecialtyEnum

    paging?: RepositoryPagingDto;
}
//#endregion

export class SearchAppointmentsByCriteriaApplicationService implements IApplicationService<SearchAppointmentsByCriteriaApplicationServiceRequest, Appointment[]> {
    get name(): string { return this.constructor.name; }

    constructor(private readonly appointmentRepository: IAppointmentRepository) { }

    async execute(dto: SearchAppointmentsByCriteriaApplicationServiceRequest): Promise<Result<Appointment[]>> {
        //Transformamos a dominio.
        const criterias: SearchAppointmentsByCriteriaDomainDto = {};



        if (dto.date) { criterias.date = AppointmentDate.create(dto.date); }
        if (dto.description) { criterias.description = AppointmentDescription.create(dto.description); }
        if (dto.duration) { criterias.duration = AppointmentDuration.create(dto.duration); }
        if (dto.status) { criterias.status = AppointmentStatus.create(dto.status); }
        if (dto.type) { criterias.type = AppointmentType.create(dto.type); }
        if (dto.patient) { criterias.patient = AppointmentPatient.create(dto.patient); }

        // TODO: CHECK AQUI 
        if (dto.doctor && dto.doctorSpecialty) { criterias.doctor = AppointmentDoctor.create(dto.doctor, DoctorSpecialty.create(dto.doctorSpecialty)); }


        //Buscamos los docores.
        const appointments = await this.appointmentRepository.findAppointmentByCriterias(criterias, dto.paging);
        return Result.success(appointments);
    }
}
