import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { IMedicalRecordRepository } from "../repositories/medical-record.repository.interface";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { MedicalRecord } from "../../../medical-record/domain/medical-record";
import { MedicalRecordID } from "../../../medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordDate } from "../../../medical-record/domain/value-objects/medical-record-date";
import { MedicalRecordPatient } from "../../../medical-record/domain/value-objects/medical-record-patient";
import { MedicalRecordAppointment } from "../../../medical-record/domain/value-objects/medical-record-appointment";
import { MedicalRecordDoctor } from "../../../medical-record/domain/value-objects/medical-record-doctor";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { IUUIDGenerator } from "../../../core/application/uuid/uuid-generator.interface";
import { InvalidDoctorException } from "../../../doctor/domain/exceptions/invalid-doctor.exception";
import { AppointmentStatus } from "../../../appointment/domain/value-objects/appointment-status";
import { AppointmentStatusEnum } from "../../..//appointment/domain/value-objects/appointment-status.enum";
import { InvalidAppointmentException } from "../../../appointment/domain/exceptions/invalid-appointment-exception";

//#region Service DTOs
export interface CreateMedicalRecordApplicationServiceDto {
    appointmentId: string,
    doctorId: string,
}
//#endregion

export class CreateMedicalRecordApplicationService implements IApplicationService<CreateMedicalRecordApplicationServiceDto, string>{

    get name(): string { return this.constructor.name; }

    constructor(
        private readonly medicalRecordRepository: IMedicalRecordRepository,
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly uuidGenerator: IUUIDGenerator,
        private readonly eventHandler: IEventHandler
    ) { }

    async execute(dto: CreateMedicalRecordApplicationServiceDto): Promise<Result<string>> {
        //Doctor
        const doctorId = DoctorId.create(dto.doctorId);


        //Cita
        const appointmentId = AppointmentId.create(dto.appointmentId);

        //Verificamos que exista la cita
        const appointment = await this.appointmentRepository.findOneByIdOrFail(appointmentId);


        //Validamos que el doctor sea el correspondiente.
        if (!appointment.Doctor.Id.equals(doctorId)) { throw new InvalidDoctorException(); }

        //Validamos que el estatus de la cita sea completada.
        if (!appointment.Status.equals(AppointmentStatus.create(AppointmentStatusEnum.COMPLETED))) { throw new InvalidAppointmentException(); }


        //Creamos el medical record
        const medicalRecord: MedicalRecord = MedicalRecord.create(
            MedicalRecordID.create(this.uuidGenerator.generate()),
            MedicalRecordDate.create(new Date(Date.now())),
            null,
            null,
            MedicalRecordPatient.create(appointment.Patient.Id),
            MedicalRecordAppointment.create(appointmentId),
            null,
            null,
            null,
            MedicalRecordDoctor.create(doctorId, appointment.Doctor.Specialty)
        )

        //Lo almacenamos
        await this.medicalRecordRepository.saveAggregate(medicalRecord);

        //Publicamos el evento
        this.eventHandler.publish(medicalRecord.pullEvents());

        //Retornamos
        return Result.success("Registro Médico registrado con exito.");
    }
}
