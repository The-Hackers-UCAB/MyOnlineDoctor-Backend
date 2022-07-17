import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorGenderException } from "../exceptions/invalid-doctor-gender.exception";
import { DoctorGenderEnum } from "./doctor-gender.enum";

export class DoctorGender implements IValueObject<DoctorGender>{
    private readonly gender: DoctorGenderEnum;

    get Value() { return this.gender; }

    private constructor(gender: DoctorGenderEnum) {
        if (Object.values(DoctorGenderEnum).includes(gender)) {
            this.gender = gender;
        }
        else {
            throw new InvalidDoctorGenderException();
        }
    }

    equals(other: DoctorGender): boolean {
        return this.gender == other.gender;
    }

    static create(status: DoctorGenderEnum): DoctorGender {
        return new DoctorGender(status);
    }
}