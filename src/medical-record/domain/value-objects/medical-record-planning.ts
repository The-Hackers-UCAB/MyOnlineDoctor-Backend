import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordPlanningException } from "../exceptions/invalid-medical-record-plannig.exception";

export class MedicalRecordPlanning implements IValueObject<MedicalRecordPlanning>{

    private readonly planning: string;

    get Value() {
        return this.planning;
    }

    private constructor(planning: string) {
        if (planning) {
            this.planning = planning;
        } else {
            throw new InvalidMedicalRecordPlanningException();
        }
    }

    equals(other: MedicalRecordPlanning): boolean {
        return this.planning === other.planning;
    }

    static create(planning: string): MedicalRecordPlanning {
        return new MedicalRecordPlanning(planning);
    }
}
