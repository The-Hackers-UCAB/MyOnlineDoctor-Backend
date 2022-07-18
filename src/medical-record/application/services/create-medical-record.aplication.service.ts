import { IApplicationService } from "src/core/application/application-service/application-service.interface";
import { Result } from "src/core/application/result-handler/result";
import { DoctorSpecialtyEnum } from "src/doctor/domain/value-objects/doctor-specialty.enum";
import { IMedicalRecordRepository } from "../repositories/medical-record.repository.interface";
import { ValidateDoctorSpecialty } from "src/doctor/domain/domain-services/validate-doctor-specialty.domain.service";
import { IPatientRepository } from "src/patient/application/repositories/patient.repository.interface";
import { IDoctorRepository } from "src/doctor/application/repositories/doctor.repository.inteface";
import { IEventHandler } from "src/core/application/event-handler/event-handler.interface";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { InvalidDoctorSpecialtyException } from "src/doctor/domain/exceptions/invalid-doctor-specialty.exception";
import { InvalidMedicalRecordDateException } from "src/medical-record/domain/exceptions/invalid-medical-record-date.exception";
import { MedicalRecord } from "src/medical-record/domain/medical-record";
import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordDate } from "src/medical-record/domain/value-objects/medical-record-date";
import { MedicalRecordDescription } from "src/medical-record/domain/value-objects/medical-record-description";
import { MedicalRecordDiagnostic } from "src/medical-record/domain/value-objects/medical-record-diagnostic";
import { MedicalRecordPatient } from "src/medical-record/domain/value-objects/medical-record-patient";
import { MedicalRecordAppointment } from "src/medical-record/domain/value-objects/medical-record-appointment";
import { MedicalRecordExams } from "src/medical-record/domain/value-objects/medical-record-exams";
import { MedicalRecordRecipe } from "src/medical-record/domain/value-objects/medical-record-recipe";
import { MedicalRecordPlannig } from "src/medical-record/domain/value-objects/medical-record-plannig";
import { MedicalRecordDoctor } from "src/medical-record/domain/value-objects/medical-record-doctor";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { IAppointmentRepository } from "src/appointment/application/repositories/appointment.repository.interface";

//#region Service DTOs
export interface CreateMedicalRecordApplicationServiceRequest{
    id: string,
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

export class CreateMedicalRecordApplicationService implements IApplicationService<CreateMedicalRecordApplicationServiceRequest, string>{

    get name(): string { return this.constructor.name; }

    private readonly validateDoctorSpecialty: ValidateDoctorSpecialty = new ValidateDoctorSpecialty();

    constructor(
        private readonly medicalRecordRepository: IMedicalRecordRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly eventHandler: IEventHandler
    ){}

    async execute(dto: CreateMedicalRecordApplicationServiceRequest): Promise<Result<string>> {
        
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
            MedicalRecordID.create(dto.id),
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