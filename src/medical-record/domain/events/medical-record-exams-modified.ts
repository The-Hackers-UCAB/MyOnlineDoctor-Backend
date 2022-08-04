import { DomainEvent } from "../../../../src/core/domain/events/domain-event";
import { MedicalRecordExams } from "../value-objects/medical-record-exams";

import { MedicalRecordID } from "../value-objects/medical-record-id";

export class MedicalRecordExamsModified extends DomainEvent {
    protected constructor(
        public id: MedicalRecordID,
        public exams: MedicalRecordExams
    ) {
        super();
    }

    static create(
        id: MedicalRecordID,
        exams: MedicalRecordExams
    ): MedicalRecordExamsModified {
        return new MedicalRecordExamsModified(id, exams);
    }
}