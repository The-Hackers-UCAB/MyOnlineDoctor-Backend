import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidPatientSurnamesException } from "../exceptions/invalid-patient-surnames.exception";

export class PatientSurnames implements IValueObject<PatientSurnames> {
    private readonly surnames: string;

    get value() { return this.surnames; }

    private constructor(surnames: string) {
        if (surnames) {
            this.surnames = surnames;
        }
        else {
            throw new InvalidPatientSurnamesException();
        }
    }

    equals(other: PatientSurnames): boolean {
        return this.surnames == other.surnames;
    }

    static create(surnames: string): PatientSurnames {
        return new PatientSurnames(surnames);
    }
}