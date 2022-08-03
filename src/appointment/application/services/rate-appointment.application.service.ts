import { InvalidPatientException } from "../../../../src/patient/domain/exceptions/invalid-patient.exception";
import { ValidatePatientActiveStatusDomainService } from "src/patient/domain/services/validate-patient-active-status.domain.service";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { InvalidPatientAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-patient-exception";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "../../../appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { Result } from "../../../core/application/result-handler/result";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { IPatientRepository } from "../../../patient/application/repositories/patient.repository.interface";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { IAppointmentRepository } from "../repositories/appointment.repository.interface";

//#region DTOs
export interface RateAppointmentApplicationServiceDto {
    id?: string;
    rating?: number;
    patientId?: string;
}
//#endregion

export class RateAppointmentApplicationService implements IApplicationService<RateAppointmentApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    private readonly validatePatientActiveStatusDomainService = new ValidatePatientActiveStatusDomainService();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly eventHandler: IEventHandler
    ) { }

    async execute(dto: RateAppointmentApplicationServiceDto): Promise<Result<string>> {
        //Encuentro la cita medica
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Verifico que la cita este asginada al paciente
        const patient = await this.patientRepository.findOneByIdOrFail(PatientId.create(dto.patientId));

        //Validamos que la cita sea del paciente
        if (!patient.Id.equals(appointment.Patient.Id)) { throw new InvalidPatientAppointmentException(); }

        //Validamos que el usuario se encuentre activo.
        if (!this.validatePatientActiveStatusDomainService.execute(patient)) { throw new InvalidPatientException(); }

        //Verificamos que la cita este iniciada.
        if (appointment.Status.Value != AppointmentStatusEnum.INICIATED) { throw new InvalidAppointmentException(); }

        //Se califica la cita
        appointment.rate(DoctorRating.create(dto.rating));

        //Guardo la cita
        this.appointmentRepository.saveAggregate(appointment);

        //Publico los eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retorno el resultado
        return Result.success('Cita Calificada.');
    }
}