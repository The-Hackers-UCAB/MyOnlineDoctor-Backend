import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorSpecialtyException } from "../exceptions/invalid-doctor-specialty.exception";
import { DoctorSpecialtyEnum } from "./doctor-specialty.enum";

export class DoctorSpecialty implements IValueObject<DoctorSpecialty>{
    private readonly specialty: DoctorSpecialtyEnum;

    get Value() { return this.specialty; }

    private constructor(specialty: DoctorSpecialtyEnum) {
        if (Object.values(DoctorSpecialtyEnum).includes(specialty)) {
            this.specialty = specialty;
        }
        else {
            throw new InvalidDoctorSpecialtyException();
        }
    }

    equals(other: DoctorSpecialty): boolean {
        return this.specialty == other.specialty;
    }

    static create(specialty: DoctorSpecialtyEnum): DoctorSpecialty {
        return new DoctorSpecialty(specialty);
    }
}