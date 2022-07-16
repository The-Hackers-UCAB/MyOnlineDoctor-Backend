import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidPatientPhoneNumberException} from "../exceptions/invalid-patient-phone-number.exception";


export class PatientPhoneNumber implements IValueObject<PatientPhoneNumber> {
    private readonly phoneNumber: string;

    get value() { return this.phoneNumber; }

    private constructor(phoneNumber: string) {
        if (phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        else {
            throw new InvalidPatientPhoneNumberException();
        }
    }

    equals(other: PatientPhoneNumber): boolean {
        return this.phoneNumber == other.phoneNumber;
    }

    static create(phoneNumber: string): PatientPhoneNumber {
        return new PatientPhoneNumber(phoneNumber);
    }
}