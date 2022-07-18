import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { IAppointmentRepository } from "../repositories/appointment.repository.interface";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";
import { AppointmentTypeEnum } from "src/appointment/domain/value-objects/appointment-type.enum";
import { AppointmentStatusEnum } from "src/appointment/domain/value-objects/appointment-status.enum";
import { Appointment } from "src/appointment/domain/appointment";
import { AppointmentDescription } from "src/appointment/domain/value-objects/appointment-description";
import { AppointmentDoctor } from "src/appointment/domain/value-objects/appointment-doctor";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { AppointmentPatient } from "src/appointment/domain/value-objects/appointment-patient";
import { AppointmentStatus } from "src/appointment/domain/value-objects/appointment-status";
import { AppointmentType } from "src/appointment/domain/value-objects/appointment-type";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { IPatientRepository } from "src/patient/application/repositories/patient.repository.interface";
import { PatientNotActiveException } from "src/patient/domain/exceptions/patient-not-active.exception";
import { ValidatePatientActiveStatusDomainService } from "src/patient/domain/services/validate-patient-active-status.domain.service";
import { IDoctorRepository } from "src/doctor/application/repositories/doctor.repository.inteface";
import { ValidateDoctorSpecialty } from "src/doctor/domain/domain-services/validate-doctor-specialty.domain.service";
import { InvalidDoctorSpecialtyException } from "src/doctor/domain/exceptions/invalid-doctor-specialty.exception";
import { IUUIDGenerator } from "src/core/application/uuid/uuid-generator.interface";
import { AppointmentDuration } from "src/appointment/domain/value-objects/appointment-duration";
import { AppointmentDate } from "src/appointment/domain/value-objects/appointment-date";

//#region Service DTOs
export interface RequestAppointmentApplicationServiceDto {
    description: string,
    type: AppointmentTypeEnum,
    patientId: string,
    doctorId: string,
    doctorSpecialty?: DoctorSpecialtyEnum
}
//#endregion

export class RequestAppointmentApplicationService implements IApplicationService<RequestAppointmentApplicationServiceDto, string> {
    get name(): string { return this.constructor.name; }

    private readonly validatePatientActiveStatus: ValidatePatientActiveStatusDomainService = new ValidatePatientActiveStatusDomainService();
    private readonly validateDoctorSpecialty: ValidateDoctorSpecialty = new ValidateDoctorSpecialty();

    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly uuidGenerator: IUUIDGenerator,
        private readonly eventHandler: IEventHandler,
    ) { }

    async execute(dto: RequestAppointmentApplicationServiceDto): Promise<Result<string>> {

        const patientId = PatientId.create(dto.patientId);

        //Verificamos que exista el paciente
        const patient = await this.patientRepository.findOneByIdOrFail(patientId);

        //Verificamos que el paciente no este suspendido
        if (!this.validatePatientActiveStatus.execute(patient)) { throw new PatientNotActiveException(); }

        const doctorId = DoctorId.create(dto.doctorId);
        const specialty = DoctorSpecialty.create(dto.doctorSpecialty);

        //Verificamos que exista el doctor
        const doctor = await this.doctorRepository.findOneByIdOrFail(doctorId);

        //Validamos que la especialidad corresponda al doctor
        if (!this.validateDoctorSpecialty.execute({ specialty, doctor })) { throw new InvalidDoctorSpecialtyException(); }

        //Creamos la cita
        const appointment: Appointment = Appointment.create(
            AppointmentId.create(this.uuidGenerator.generate()),
            AppointmentDate.create(null),
            AppointmentDescription.create(dto.description),
            AppointmentDuration.create(null),
            AppointmentStatus.create(AppointmentStatusEnum.REQUESTED),
            AppointmentType.create(dto.type),
            AppointmentPatient.create(patientId),
            AppointmentDoctor.create(
                doctorId,
                specialty
            )
        );

        //La almacenamos
        await this.appointmentRepository.saveAggregate(appointment);

        //Publicamos eventos
        this.eventHandler.publish(appointment.pullEvents());

        //Retornamos
        return Result.success("Cita solicitada exitosamente.");
    }
}
