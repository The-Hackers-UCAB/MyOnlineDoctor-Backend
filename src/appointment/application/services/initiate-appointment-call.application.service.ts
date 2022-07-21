import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { InvalidDoctorAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-doctor-exception";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "../../../appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { IPatientRepository } from "../../../patient/application/repositories/patient.repository.interface";
import { InvalidPatientException } from "../../../patient/domain/exceptions/invalid-patient.exception";
import { ValidatePatientActiveStatusDomainService } from "../../../patient/domain/services/validate-patient-active-status.domain.service";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { ValidateAppointmentDateCallDomainService } from "../../../appointment/domain/services/validate-appointment-date-calll.domain.service";
import { InvalidDateAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-date-exception";

//#Region Service Dtos
export interface InitiateAppointmentCallApplicationServiceDto {
    id?: string;
    doctorId?: string;
}
//#endregion

export class InitiateAppointmentCallApplicationService implements IApplicationService<InitiateAppointmentCallApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    private readonly validatePatientActiveStatusDomainService = new ValidatePatientActiveStatusDomainService();
    private readonly validateAppointmentDateCallDomainService = new ValidateAppointmentDateCallDomainService();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(dto: InitiateAppointmentCallApplicationServiceDto): Promise<Result<string>> {
        //Buscamos la cita medica
        const appointment = await this.appointmentRepository.findOneByIdOrFail(AppointmentId.create(dto.id));

        //Verificamos que la cita sea del doctor
        const doctor = await this.doctorRepository.findOneByIdOrFail(DoctorId.create(dto.doctorId));

        if (!doctor.Id.equals(appointment.Doctor.Id)) {
            throw new InvalidDoctorAppointmentException();
        }

        //Verificamos que su estado sea aceptado.
        if (appointment.Status.Value != AppointmentStatusEnum.ACCEPTED) {
            throw new InvalidAppointmentException();
        }

        /* Para la demostración se desactiva la verificación de la fecha de la cita.
        if (!this.validateAppointmentDateCallDomainService.execute(appointment)) {
            throw new InvalidDateAppointmentException();
        }
        */

        //Buscamos al paciente
        const patient = await this.patientRepository.findOneByIdOrFail(appointment.Patient.Id)

        //Verificamos que el paciente este activo.
        if (!this.validatePatientActiveStatusDomainService.execute(patient)) {
            throw new InvalidPatientException();
        }

        //Retorno el resultado
        return Result.success('Llamada iniciada.');
    }
}