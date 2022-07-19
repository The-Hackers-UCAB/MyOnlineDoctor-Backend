import { IAppointmentRepository } from "src/appointment/application/repositories/appointment.repository.interface";
import { InvalidAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-exception";
import { InvalidPatientAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-patient-exception";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "src/core/application/application-service/application.service.interface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { Result } from "src/core/application/result-handler/result";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { IPatientRepository } from "../../../patient/application/repositories/patient.repository.interface";

//#Region Service Dtos
export interface IniciateAppointmentApplicationServiceDto {
    id?: string;
    patientId?: string;
}
//#endregion

export class IniciateAppointmentApplicationService implements IApplicationService<IniciateAppointmentApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly eventHandler: IEventHandler,
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(dto: IniciateAppointmentApplicationServiceDto): Promise<Result<string>> {
        //Encuentro la cita medica
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Verifico que la cita este asginada al paciente
        const patient = await this.patientRepository.findOneByIdOrFail(PatientId.create(dto.patientId));

        if (!patient.Id.equals(appointment.Patient.Id)) {
            throw new InvalidPatientAppointmentException();
        }

        //Cambio el estado a iniciada
        if (appointment.Status.Value != AppointmentStatusEnum.ACCEPTED) {
            throw new InvalidAppointmentException();
        }
        
        //inicio la cita
        appointment.iniciate();

        //Guardo la cita
        this.appointmentRepository.saveAggregate(appointment);

        //Publico los eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retorno el resultado
        return Result.success('Cita iniciada');

    }
}