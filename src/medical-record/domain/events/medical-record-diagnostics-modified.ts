import { DomainEvent } from "src/core/domain/events/domain-event";
import { MedicalRecordDiagnostic } from "../value-objects/medical-record-diagnostic";

import { MedicalRecordID } from "../value-objects/medical-record-id";

export class MedicalRecordDiagnosticModified extends DomainEvent {
    protected constructor(
        public id: MedicalRecordID,
        public diagnostic: MedicalRecordDiagnostic
    ) {
        super();
    }

    static create(
        id: MedicalRecordID,
        diagnostic: MedicalRecordDiagnostic
    ): MedicalRecordDiagnosticModified {
        return new MedicalRecordDiagnosticModified(id, diagnostic);
    }
}