import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { InvalidDoctorAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-doctor-exception";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "../../../appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { Result } from "../../../core/application/result-handler/result";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { ValidateDoctorActiveStatusDomainService } from "../../../../src/doctor/domain/domain-services/validate-doctor-active-status.domain.service";
import { InvalidDoctorException } from "../../../../src/doctor/domain/exceptions/invalid-doctor.exception";

//#Region Service Dtos
export interface CancelDoctorAppointmentApplicationServiceDto {
    id?: string;
    doctorId?: string;
}
//#endregion

export class CancelDoctorAppointmentApplicationService implements IApplicationService<CancelDoctorAppointmentApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    private readonly validateDoctorActiveStatusDomainService = new ValidateDoctorActiveStatusDomainService();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly eventHandler: IEventHandler,
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(dto: CancelDoctorAppointmentApplicationServiceDto): Promise<Result<string>> {
        //Encuentro la cita medica
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Verifico que la cita sea del doctor
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));

        //Validamos que la cita pertenezca al doctor.
        if (!doctor.Id.equals(appointment.Doctor.Id)) { throw new InvalidDoctorAppointmentException(); }

        //Validamos que el doctor este activo.
        if (!this.validateDoctorActiveStatusDomainService.execute(doctor)) { throw new InvalidDoctorException(); }

        //Valido que la cita a rechazar no este ni aceptada o agendada.
        if (appointment.Status.Value != AppointmentStatusEnum.ACCEPTED && appointment.Status.Value != AppointmentStatusEnum.SCHEDULED) { throw new InvalidAppointmentException(); }

        //Cancelamos la cita.
        appointment.cancel();

        //Almacenamos la cita
        this.appointmentRepository.saveAggregate(appointment);

        //Publico los eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retorno el resultado
        return Result.success('Cita cancelada');
    }
}