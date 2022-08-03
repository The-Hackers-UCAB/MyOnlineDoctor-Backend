import { Appointment } from "../../../src/appointment/domain/appointment";
import { UUIDGenerator } from "../../../src/core/infrastructure/uuid/uuid-generator";
import { MedicalRecord } from "../../../src/medical-record/domain/medical-record";
import { MedicalRecordAppointment } from "../../../src/medical-record/domain/value-objects/medical-record-appointment";
import { MedicalRecordDate } from "../../../src/medical-record/domain/value-objects/medical-record-date";
import { MedicalRecordDoctor } from "../../../src/medical-record/domain/value-objects/medical-record-doctor";
import { MedicalRecordID } from "../../../src/medical-record/domain/value-objects/medical-record-id";
import { MedicalRecordPatient } from "../../../src/medical-record/domain/value-objects/medical-record-patient";

export class MedicalRecordObjectMother {
    static createMedicalRecord(appointment: Appointment) {
        const uuid = new UUIDGenerator();

        const medicalRecord: MedicalRecord = MedicalRecord.create(
            MedicalRecordID.create(uuid.generate()),
            MedicalRecordDate.create(new Date(Date.now())),
            null,
            null,
            MedicalRecordPatient.create(appointment.Patient.Id),
            MedicalRecordAppointment.create(appointment.Id),
            null,
            null,
            null,
            MedicalRecordDoctor.create(appointment.Doctor.Id, appointment.Doctor.Specialty)
        )

        return medicalRecord;
    }
}