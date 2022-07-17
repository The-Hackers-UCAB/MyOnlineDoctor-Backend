import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidPatientSurgeriesException } from "../exceptions/invalid-patient-surgeries.exception";


export class PatientSurgeries implements IValueObject<PatientSurgeries> {
    private readonly surgeries: string;

    get Value() { return this.surgeries; }

    private constructor(surgeries: string) {
        if (surgeries) {
            this.surgeries = surgeries;
        }
        else {
            throw new InvalidPatientSurgeriesException();
        }
    }

    equals(other: PatientSurgeries): boolean {
        return this.surgeries == other.surgeries;
    }

    static create(surgeries: string): PatientSurgeries {
        return new PatientSurgeries(surgeries);
    }
}