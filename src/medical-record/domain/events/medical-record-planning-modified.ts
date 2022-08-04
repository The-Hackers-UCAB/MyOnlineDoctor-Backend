import { DomainEvent } from "../../../../src/core/domain/events/domain-event";
import { MedicalRecordID } from "../value-objects/medical-record-id";
import { MedicalRecordPlanning } from "../value-objects/medical-record-planning";

export class MedicalRecordPlanningModified extends DomainEvent{

    protected constructor(
        public id: MedicalRecordID,
        public planning: MedicalRecordPlanning
    ){
        super();
    }

    static create(
        id: MedicalRecordID,
        planning: MedicalRecordPlanning
    ):MedicalRecordPlanningModified{
        return new MedicalRecordPlanningModified(id,planning);
    }
}