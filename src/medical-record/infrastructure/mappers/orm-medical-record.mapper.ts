import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";
import { IMapper } from "src/core/application/mappers/mapper.interface";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";
import { MedicalRecord } from "src/medical-record/domain/medical-record";
import { MedicalRecordAppointment } from "src/medical-record/domain/value-objects/medical-record-appointment";
import { MedicalRecordDate } from "src/medical-record/domain/value-objects/medical-record-date";
import { MedicalRecordDescription } from "src/medical-record/domain/value-objects/medical-record-description";
import { MedicalRecordDiagnostic } from "src/medical-record/domain/value-objects/medical-record-diagnostic";
import { MedicalRecordDoctor } from "src/medical-record/domain/value-objects/medical-record-doctor";
import { MedicalRecordExams } from "src/medical-record/domain/value-objects/medical-record-exams";
import { MedicalRecordID } from "src/medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordPatient } from "src/medical-record/domain/value-objects/medical-record-patient";
import { MedicalRecordPlannig } from "src/medical-record/domain/value-objects/medical-record-plannig";
import { MedicalRecordRecipe } from "src/medical-record/domain/value-objects/medical-record-recipe";
import { PatientId } from "src/patient/domain/value-objects/patient-id";
import { OrmMedicalRecord } from "../entities/orm.medical-record.entity";

export class OrmMedicalRecordMapper implements IMapper<MedicalRecord, OrmMedicalRecord>{

    async fromDomainToOther(domain: MedicalRecord): Promise<OrmMedicalRecord> {
        
        //Verificamos que no sea null
        if (!domain) { return null; }

        //Creamos un objeto de medical record de tipo ORM.
        const ormMedicalRecord: OrmMedicalRecord = await OrmMedicalRecord.create(
            domain.Id.Value,
            domain.Date.Value,
            domain.Description.Value,
            domain.Diagnostic.Value,
            domain.Exams.Value,
            domain.Recipe.Value,
            domain.Plannig.Value,
            domain.Doctor.Id.Value,
            domain.Patient.Id.Value,
            domain.Appointment.Id.Value,
            domain.Doctor.Specialty.Value
        )

        return ormMedicalRecord;
    }

    async fromOtherToDomain(other: OrmMedicalRecord): Promise<MedicalRecord> {
        
        //Verificamos que no sea null
        if (!other) { return null; }

        //Creamos el objeto de medical record de dominio.
        const medicalRecord: MedicalRecord = MedicalRecord.create(
            MedicalRecordID.create(other.id),
            MedicalRecordDate.create(other.date),
            MedicalRecordDescription.create(other.description),
            MedicalRecordDiagnostic.create(other.diagnostic),
            MedicalRecordPatient.create(PatientId.create(other.patientId)),
            MedicalRecordAppointment.create(AppointmentId.create(other.appointmentId)),
            MedicalRecordExams.create(other.exams),
            MedicalRecordRecipe.create(other.recipe),
            MedicalRecordPlannig.create(other.plannig),
            MedicalRecordDoctor.create(
                DoctorId.create(other.doctorId),
                DoctorSpecialty.create(other.specialty.specialty)
            )
        )

        //Removemos los eventos ya que se está restaurando mas no creado
        medicalRecord.pullEvents();

        return medicalRecord;
        
    }
}