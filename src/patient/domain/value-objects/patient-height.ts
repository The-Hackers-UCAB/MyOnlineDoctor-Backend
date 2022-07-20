import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientHeightException } from "../exceptions/invalid-patient-height.exception";


export class PatientHeight implements IValueObject<PatientHeight> {
    private readonly height: number;

    get Value() { return this.height; }

    private constructor(height: number) {
        if (height) {
            this.height = height;
        }
        else {
            throw new InvalidPatientHeightException();
        }
    }

    equals(other: PatientHeight): boolean {
        return this.height == other.height;
    }

    static create(height: number): PatientHeight {
        return new PatientHeight(height);
    }
}