import { IApplicationService } from "../../../core/application/application-service/application.service.interface";
import { Result } from "../../../core/application/result-handler/result";
import { DoctorSpecialtyEnum } from "../../../doctor/domain/value-objects/doctor-specialty.enum";
import { IMedicalRecordRepository } from "../repositories/medical-record.repository.interface";
import { ValidateDoctorSpecialty } from "../../../doctor/domain/domain-services/validate-doctor-specialty.domain.service";
import { IPatientRepository } from "../../../patient/application/repositories/patient.repository.interface";
import { IDoctorRepository } from "../../../doctor/application/repositories/doctor.repository.inteface";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty";
import { InvalidDoctorSpecialtyException } from "../../../doctor/domain/exceptions/invalid-doctor-specialty.exception";
import { InvalidMedicalRecordDateException } from "../../../medical-record/domain/exceptions/invalid-medical-record-date.exception";
import { MedicalRecord } from "../../../medical-record/domain/medical-record";
import { MedicalRecordID } from "../../../medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordDate } from "../../../medical-record/domain/value-objects/medical-record-date";
import { MedicalRecordDescription } from "../../../medical-record/domain/value-objects/medical-record-description";
import { MedicalRecordDiagnostic } from "../../../medical-record/domain/value-objects/medical-record-diagnostic";
import { MedicalRecordPatient } from "../../../medical-record/domain/value-objects/medical-record-patient";
import { MedicalRecordAppointment } from "../../../medical-record/domain/value-objects/medical-record-appointment";
import { MedicalRecordExams } from "../../../medical-record/domain/value-objects/medical-record-exams";
import { MedicalRecordRecipe } from "../../../medical-record/domain/value-objects/medical-record-recipe";
import { MedicalRecordPlannig } from "../../../medical-record/domain/value-objects/medical-record-plannig";
import { MedicalRecordDoctor } from "../../../medical-record/domain/value-objects/medical-record-doctor";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { IAppointmentRepository } from "../../../appointment/application/repositories/appointment.repository.interface";
import { IUUIDGenerator } from "../../../core/application/uuid/uuid-generator.interface";

//#region Service DTOs
export interface CreateMedicalRecordApplicationServiceDto {
    date: Date,
    description: string,
    diagnostic: string,
    patientId: string,
    appointmentId: string,
    exams: string,
    recipe?: string
    doctorId: string,
    doctorSpecialty: DoctorSpecialtyEnum,
    planning?: string
}
//#endregion

export class CreateMedicalRecordApplicationService implements IApplicationService<CreateMedicalRecordApplicationServiceDto, string>{

    get name(): string { return this.constructor.name; }

    private readonly validateDoctorSpecialty: ValidateDoctorSpecialty = new ValidateDoctorSpecialty();

    constructor(
        private readonly medicalRecordRepository: IMedicalRecordRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly uuidGenerator: IUUIDGenerator,
        private readonly eventHandler: IEventHandler
    ) { }

    async execute(dto: CreateMedicalRecordApplicationServiceDto): Promise<Result<string>> {

        //Paciente
        const patientId = PatientId.create(dto.patientId);

        //Verificamos que exista el paciente
        const patient = await this.patientRepository.findOneByIdOrFail(patientId);

        //Doctor
        const doctorId = DoctorId.create(dto.doctorId);
        const specialty = DoctorSpecialty.create(dto.doctorSpecialty);

        //Verificamos que exista el doctor
        const doctor = await this.doctorRepository.findOneByIdOrFail(doctorId);

        //Validamos que la especialidad corresponda al doctor
        if (this.validateDoctorSpecialty.execute({ specialty, doctor })) { throw new InvalidDoctorSpecialtyException(); }

        //Cita
        const appointmentId = AppointmentId.create(dto.appointmentId);

        //Verificamos que exista la cita
        const appointment = await this.appointmentRepository.findOneByIdOrFail(appointmentId)

        //Verificamos la fecha
        if (new Date(dto.date) < (new Date(Date.now()))) { throw new InvalidMedicalRecordDateException(); }

        //Creamos el medical record
        const medicalRecord: MedicalRecord = MedicalRecord.create(
            MedicalRecordID.create(this.uuidGenerator.generate()),
            MedicalRecordDate.create(dto.date),
            MedicalRecordDescription.create(dto.description),
            MedicalRecordDiagnostic.create(dto.diagnostic),
            MedicalRecordPatient.create(patientId),
            MedicalRecordAppointment.create(appointmentId),
            MedicalRecordExams.create(dto.exams),
            MedicalRecordRecipe.create(dto.recipe),
            MedicalRecordPlannig.create(dto.planning),
            MedicalRecordDoctor.create(doctorId, specialty)
        )

        //Lo almacenamos
        await this.medicalRecordRepository.saveAggregate(medicalRecord);

        //Publicamos el evento
        this.eventHandler.publish(medicalRecord.pullEvents());

        //Retornamos
        return Result.success("Registro Médico registrado con exito.");
    }
}