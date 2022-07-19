import { InvalidAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-exception";
import { InvalidPatientAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-patient-exception";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "src/core/application/application-service/application.service.interface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { Result } from "src/core/application/result-handler/result";
import { DoctorRating } from "src/doctor/domain/value-objects/doctor-rating";
import { IPatientRepository } from "src/patient/application/repositories/patient.repository.interface";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { IAppointmentRepository } from "../repositories/appointment.repository.interface";


export interface RateAppointmentApplicationServiceDto {
    id?: string;
    rating?: number;
    patientId?: string;
}


export class RateAppointmentApplicationService implements IApplicationService<RateAppointmentApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly eventHandler: IEventHandler,
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(dto: RateAppointmentApplicationServiceDto): Promise<Result<string>> {
        //Encuentro la cita medica
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));
        console.log(appointment);

        //Verifico que la cita este asginada al paciente
        const patient = await this.patientRepository.findOneByIdOrFail(PatientId.create(dto.patientId));

        if (!patient.Id.equals(appointment.Patient.Id)) {
            throw new InvalidPatientAppointmentException();
        }
        //Cambio el estado de la cita a rechazada
        if (appointment.Status.Value != AppointmentStatusEnum.INICIATED) {
            throw new InvalidAppointmentException();
        }

        //Se califica la cita
        appointment.rate(DoctorRating.create(dto.rating));

        //Guardo la cita
        this.appointmentRepository.saveAggregate(appointment);

        //Publico los eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retorno el resultado
        return Result.success('Cita calificada');

    }
}