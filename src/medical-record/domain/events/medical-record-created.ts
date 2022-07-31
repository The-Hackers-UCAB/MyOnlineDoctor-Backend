import { MedicalRecordID } from "../value-objects/medical-record-id";
import { MedicalRecordDate } from "../value-objects/medical-record-date";
import { MedicalRecordDescription } from "../value-objects/medical-record-description";
import { MedicalRecordDiagnostic } from "../value-objects/medical-record-diagnostic";
import { MedicalRecordPatient } from "../value-objects/medical-record-patient";
import { MedicalRecordAppointment } from "../value-objects/medical-record-appointment";
import { MedicalRecordExams } from "../value-objects/medical-record-exams";
import { MedicalRecordRecipe } from "../value-objects/medical-record-recipe";
import { MedicalRecordPlannig } from "../value-objects/medical-record-plannig";
import { MedicalRecordDoctor } from "../value-objects/medical-record-doctor";
import { DomainEvent } from "../../../core/domain/events/domain-event";

export class MedicalRecordCreated extends DomainEvent {

    protected constructor(
        public id: MedicalRecordID,
        public date: MedicalRecordDate,
        public description: MedicalRecordDescription,
        public diagnostic: MedicalRecordDiagnostic,
        public patient: MedicalRecordPatient,
        public appointment: MedicalRecordAppointment,
        public exams: MedicalRecordExams,
        public recipe: MedicalRecordRecipe,
        public plannig: MedicalRecordPlannig,
        public doctor: MedicalRecordDoctor
    ) {
        super();
    }

    static create(
        id: MedicalRecordID,
        date: MedicalRecordDate,
        description: MedicalRecordDescription,
        diagnostic: MedicalRecordDiagnostic,
        patient: MedicalRecordPatient,
        appointment: MedicalRecordAppointment,
        exams: MedicalRecordExams,
        recipe: MedicalRecordRecipe,
        plannig: MedicalRecordPlannig,
        doctor: MedicalRecordDoctor
    ): MedicalRecordCreated {
        return new MedicalRecordCreated(id, date, description, diagnostic, patient, appointment, exams, recipe, plannig, doctor);
    }
}