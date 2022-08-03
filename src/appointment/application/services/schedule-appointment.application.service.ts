import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { IAppointmentRepository } from "../repositories/appointment.repository.interface";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { AppointmentDuration } from "../../../appointment/domain/value-objects/appointment-duration";
import { AppointmentDate } from "../../../appointment/domain/value-objects/appointment-date";
import { ValidateAppointmentSchedulingStatusDomainService } from "../../../appointment/domain/services/validate-appointment-scheduling-status.domain.service";
import { InvalidDoctorException } from "../../../doctor/domain/exceptions/invalid-doctor.exception";
import { InvalidDateAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-date-exception";
import { InvalidDoctorAppointmentException } from "../../../../src/appointment/domain/exceptions/invalid-appointment-doctor-exception";
import { ValidateDoctorActiveStatusDomainService } from "../../../../src/doctor/domain/domain-services/validate-doctor-active-status.domain.service";

//#region Service DTOs
export interface ScheduleAppointmentApplicationServiceDto {
    id?: string;
    date?: Date;
    duration?: number;
    doctorId?: string;
}
//#endregion

export class ScheduleAppointmentApplicationService implements IApplicationService<ScheduleAppointmentApplicationServiceDto, string> {
    get name(): string { return this.constructor.name; }

    private readonly validateAppointmentSchedulingStatusDomainService = new ValidateAppointmentSchedulingStatusDomainService();
    private readonly validateDoctorActiveStatusDomainService = new ValidateDoctorActiveStatusDomainService();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly eventHandler: IEventHandler,
    ) { }

    async execute(dto: ScheduleAppointmentApplicationServiceDto): Promise<Result<string>> {
        //Verificamos que la fecha sea actual.
        if (dto.date < (new Date(Date.now()))) { throw new InvalidDateAppointmentException(); }

        //Buscamos la cita
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Buscamos el doctor
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));

        //Validamos que la cita pertenezca al doctor.
        if (!doctor.Id.equals(appointment.Doctor.Id)) { throw new InvalidDoctorAppointmentException(); }

        //Validamos que el doctor este activo.
        if (!this.validateDoctorActiveStatusDomainService.execute(doctor)) { throw new InvalidDoctorException(); }

        //Validamos que la cita este solicitada
        this.validateAppointmentSchedulingStatusDomainService.execute(appointment);

        //Agendamos la cita.
        appointment.scheduleAppointment(
            AppointmentDate.create(dto.date),
            AppointmentDuration.create(dto.duration)
        );

        //Persistimos los cambios.
        await this.appointmentRepository.saveAggregate(appointment);

        //Publicamos los eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retornamos
        return Result.success("Cita Agendada Exitosamente.");
    }
}
