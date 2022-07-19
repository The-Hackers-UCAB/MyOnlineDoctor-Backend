import { IAppointmentRepository } from "src/appointment/application/repositories/appointment.repository.interface";
import { InvalidDoctorAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-doctor-exception";
import { InvalidAppointmentException } from "src/appointment/domain/exceptions/invalid-appointment-exception";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { IApplicationService } from "src/core/application/application-service/application.service.interface";
import { Result } from "src/core/application/result-handler/result";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { IPatientRepository } from "src/patient/application/repositories/patient.repository.interface";
import { InvalidPatientException } from "src/patient/domain/exceptions/invalid-patient.exception";
import { ValidatePatientActiveStatusDomainService } from "src/patient/domain/services/validate-patient-active-status.domain.service";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";

//#Region Service Dtos
export interface InitiateAppointmentCallApplicationServiceDto {
    id?: string;
    doctorId?: string;
}
//#endregion

export class InitiateAppointmentCallApplicationService implements IApplicationService<InitiateAppointmentCallApplicationServiceDto, string> {

    get name(): string { return this.constructor.name; }

    private readonly validatePatientActiveStatusDomainService = new ValidatePatientActiveStatusDomainService();

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