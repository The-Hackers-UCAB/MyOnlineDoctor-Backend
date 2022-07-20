import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { IAppointmentRepository } from "../repositories/appointment.repository.interface";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { AppointmentDuration } from "../../../appointment/domain/value-objects/appointment-duration";
import { AppointmentDate } from "../../../appointment/domain/value-objects/appointment-date";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { ValidateAppointmentSchedulingStatusDomainService } from "../../../appointment/domain/services/validate-appointment-scheduling-status.domain.service";
import { DoctorStatusEnum } from "../../../doctor/domain/value-objects/doctor-status.enum";
import { InvalidDoctorException } from "../../../doctor/domain/exceptions/invalid-doctor.exception";
import { InvalidDateAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-date-exception";

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

    private readonly validateAppointmentSchedulingStatusDomainService: ValidateAppointmentSchedulingStatusDomainService = new ValidateAppointmentSchedulingStatusDomainService();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly eventHandler: IEventHandler,
    ) { }

    async execute(dto: ScheduleAppointmentApplicationServiceDto): Promise<Result<string>> {

        //Verificamos que la fecha sea actual.
        if (dto.date < (new Date(Date.now()))) { throw new InvalidDateAppointmentException(); }

        //Buscamos el doctor que esta agendando la cita.
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));

        //Verificamos que el doctor pueda agendar citas.
        if (doctor.Status.Value != DoctorStatusEnum.ACTIVE) { throw new InvalidDoctorException(); }

        //Buscamos la cita
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Verificamos que el doctor que agenda sea el de la cita.
        if (!appointment.Doctor.Id.equals(doctor.Id)) { throw new InvalidAppointmentException(); }

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
