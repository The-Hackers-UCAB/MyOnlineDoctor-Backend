import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientIdException } from "../exceptions/invalid-patient-id.exception";


export class PatientNames implements IValueObject<PatientNames> {
    private readonly firstName: string;
    private readonly secondName?: string;

    get FirstName() { return this.firstName; }
    get MiddleName() { return this.secondName; }

    private constructor(firstName: string, lastName: string) {
        if (firstName && lastName) {
            this.firstName = firstName;
            this.secondName = lastName;
        }
        else {
            throw new InvalidPatientIdException();
        }
    }

    equals(other: PatientNames): boolean {
        return this.firstName == other.firstName && this.secondName == other.secondName;
    }

    static create(firstName: string, secondName?: string): PatientNames {
        return new PatientNames(firstName, secondName);
    }
}