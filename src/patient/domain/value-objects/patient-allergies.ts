import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidPatientAllergiesException } from "../exceptions/invalid-patient-allergies.exception";


export class PatientAllergies implements IValueObject<PatientAllergies> {
    private readonly allergies: string;

    get Value() { return this.allergies; }

    private constructor(allergies: string) {
        if (allergies) {
            this.allergies = allergies;
        }
        else {
            throw new InvalidPatientAllergiesException();
        }
    }

    equals(other: PatientAllergies): boolean {
        return this.allergies == other.allergies;
    }

    static create(allergies: string): PatientAllergies {
        return new PatientAllergies(allergies);
    }
}