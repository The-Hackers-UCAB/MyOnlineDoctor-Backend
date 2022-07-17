import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidPatientWeightException } from "../exceptions/invalid-patient-weight.exception";


export class PatientWeight implements IValueObject<PatientWeight> {
    private readonly weight: number;

    get Value() { return this.weight; }

    private constructor(weight: number) {
        if (weight) {
            this.weight = weight;
        }
        else {
            throw new InvalidPatientWeightException();
        }
    }

    equals(other: PatientWeight): boolean {
        return this.weight == other.weight;
    }

    static create(weight: number): PatientWeight {
        return new PatientWeight(weight);
    }
}
