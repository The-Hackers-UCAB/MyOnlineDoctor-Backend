import { IAppointmentRepository } from "src/appointment/application/repositories/appointment.repository.interface";
import { InvalidDoctorAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-doctor-exception";
import { InvalidAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-exception";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "src/core/application/application-service/application.service.interface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { Result } from "src/core/application/result-handler/result";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";

//#Region Service Dtos
export interface CancelDoctorAppointmentApplicationServiceDto {
    id?: string;
    doctorId?: string;
}
//#endregion

export class CancelDoctorAppointmentApplicationService implements IApplicationService<CancelDoctorAppointmentApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

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

        if (!doctor.Id.equals(appointment.Doctor.Id)) {
            throw new InvalidDoctorAppointmentException();
        }

        //Cambio el estado de la cita a rechazada
        if (appointment.Status.Value != AppointmentStatusEnum.ACCEPTED && appointment.Status.Value != AppointmentStatusEnum.SCHEDULED) {
            throw new InvalidAppointmentException();
        }
        appointment.cancel();

        //Guardo la cita
        this.appointmentRepository.saveAggregate(appointment);

        //Publico los eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retorno el resultado
        return Result.success('Cita cancelada');

    }
}