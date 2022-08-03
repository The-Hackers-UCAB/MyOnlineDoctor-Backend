import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { InvalidPatientAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-patient-exception";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "../../../appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { Result } from "../../../core/application/result-handler/result";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { IPatientRepository } from "../../../patient/application/repositories/patient.repository.interface";
import { ValidatePatientActiveStatusDomainService } from "../../../../src/patient/domain/services/validate-patient-active-status.domain.service";
import { InvalidPatientException } from "../../../../src/patient/domain/exceptions/invalid-patient.exception";

//#Region Service Dtos
export interface InitiateAppointmentApplicationServiceDto {
    id?: string;
    patientId?: string;
}
//#endregion

export class InitiateAppointmentApplicationService implements IApplicationService<InitiateAppointmentApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    private readonly validatePatientActiveStatusDomainService = new ValidatePatientActiveStatusDomainService();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly eventHandler: IEventHandler,
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(dto: InitiateAppointmentApplicationServiceDto): Promise<Result<string>> {
        //Encuentro la cita medica
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Verifico que la cita este asginada al paciente
        const patient = await this.patientRepository.findOneByIdOrFail(PatientId.create(dto.patientId));

        //Validamos que la cita sea del paciente
        if (!patient.Id.equals(appointment.Patient.Id)) { throw new InvalidPatientAppointmentException(); }

        //Validamos que el usuario se encuentre activo.
        if (!this.validatePatientActiveStatusDomainService.execute(patient)) { throw new InvalidPatientException(); }

        //Validamos que el estado de la cita no sea distinta a aceptada.
        if (appointment.Status.Value != AppointmentStatusEnum.ACCEPTED) { throw new InvalidAppointmentException(); }

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