import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorNamesException } from "../exceptions/invalid-doctor-names.exception";

export class DoctorNames implements IValueObject<DoctorNames>{
    private readonly firstName: string;
    private readonly middleName?: string;

    get FirstName() { return this.firstName; }
    get MiddleName() { return this.middleName; }

    private constructor(firstName: string, middleName?: string) {
        let error: boolean = false;

        if (!firstName || firstName.length < 3) {
            error = true;
        }

        if (middleName && middleName.length < 3) {
            error = true;
        }


        if (error) {
            throw new InvalidDoctorNamesException();
        }
        else {
            this.firstName = firstName;
            this.middleName = middleName;
        }
    }

    equals(other: DoctorNames): boolean {
        return this.firstName == other.firstName && this.middleName == other.middleName
    }

    static create(firstName: string, middleName?: string): DoctorNames {
        return new DoctorNames(firstName, middleName);
    }
}