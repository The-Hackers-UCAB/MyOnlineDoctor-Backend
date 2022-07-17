import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientGenderException } from "../exceptions/invalid-patient-gender.exception";
import { PatientGenderEnum } from "./patient-gender.enum";

export class PatientGender implements IValueObject<PatientGender>{
    private readonly gender: PatientGenderEnum;

    get Value() { return this.gender; }

    private constructor(gender: PatientGenderEnum) {
        if (Object.values(PatientGenderEnum).includes(gender)) {
            this.gender = gender;
        }
        else {
            throw new InvalidPatientGenderException();
        }
    }

    equals(other: PatientGender): boolean {
        return this.gender == other.gender;
    }

    static create(gender: PatientGenderEnum): PatientGender {
        return new PatientGender(gender);
    }
}
