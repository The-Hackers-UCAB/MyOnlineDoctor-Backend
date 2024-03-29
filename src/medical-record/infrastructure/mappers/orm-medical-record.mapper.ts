import { AppointmentId } from "../../../appointment/domain/value-objects/appointment-id";
import { IMapper } from "../../../core/application/mappers/mapper.interface";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty";
import { MedicalRecord } from "../../../medical-record/domain/medical-record";
import { MedicalRecordAppointment } from "../../../medical-record/domain/value-objects/medical-record-appointment";
import { MedicalRecordDate } from "../../../medical-record/domain/value-objects/medical-record-date";
import { MedicalRecordDescription } from "../../../medical-record/domain/value-objects/medical-record-description";
import { MedicalRecordDiagnostic } from "../../../medical-record/domain/value-objects/medical-record-diagnostic";
import { MedicalRecordDoctor } from "../../../medical-record/domain/value-objects/medical-record-doctor";
import { MedicalRecordExams } from "../../../medical-record/domain/value-objects/medical-record-exams";
import { MedicalRecordID } from "../../../medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordPatient } from "../../../medical-record/domain/value-objects/medical-record-patient";
import { MedicalRecordPlanning } from "../../domain/value-objects/medical-record-planning";
import { MedicalRecordRecipe } from "../../../medical-record/domain/value-objects/medical-record-recipe";
import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { OrmMedicalRecord } from "../entities/orm.medical-record.entity";

export class OrmMedicalRecordMapper implements IMapper<MedicalRecord, OrmMedicalRecord>{

    async fromDomainToOther(domain: MedicalRecord): Promise<OrmMedicalRecord> {

        //Verificamos que no sea null
        if (!domain) { return null; }

        //Creamos un objeto de medical record de tipo ORM.
        const ormMedicalRecord: OrmMedicalRecord = await OrmMedicalRecord.create(
            domain.Id.Value,
            domain.Date.Value,
            domain.Description?.Value,
            domain.Diagnostic?.Value,
            domain.Exams?.Value,
            domain.Recipe?.Value,
            domain.Planning?.Value,
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
            other.description ? MedicalRecordDescription.create(other.description) : null,
            other.diagnostic ? MedicalRecordDiagnostic.create(other.diagnostic) : null,
            MedicalRecordPatient.create(PatientId.create(other.patientId)),
            MedicalRecordAppointment.create(AppointmentId.create(other.appointmentId)),
            other.exams ? MedicalRecordExams.create(other.exams) : null,
            other.recipe ? MedicalRecordRecipe.create(other.recipe) : null,
            other.planning ? MedicalRecordPlanning.create(other.planning) : null,
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