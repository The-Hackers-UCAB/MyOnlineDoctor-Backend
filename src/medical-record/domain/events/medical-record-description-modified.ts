import { DomainEvent } from "../../../../src/core/domain/events/domain-event";
import { MedicalRecordDescription } from "../value-objects/medical-record-description";
import { MedicalRecordID } from "../value-objects/medical-record-id";

export class MedicalRecordDescriptionModified extends DomainEvent {
    protected constructor(
        public id: MedicalRecordID,
        public description: MedicalRecordDescription
    ) {
        super();
    }

    static create(
        id: MedicalRecordID,
        description: MedicalRecordDescription
    ): MedicalRecordDescriptionModified {
        return new MedicalRecordDescriptionModified(id, description);
    }
}