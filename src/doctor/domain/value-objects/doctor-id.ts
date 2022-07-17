import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorIdException } from "../exceptions/invalid-doctor-id.exception";

export class DoctorId implements IValueObject<DoctorId>{
    private readonly id: number;

    get Value() { return this.id; }

    private constructor(id: number) {
        if (id) {
            this.id = id;
        }
        else {
            throw new InvalidDoctorIdException();
        }
    }

    equals(other: DoctorId): boolean {
        return this.id == other.id;
    }

    static create(id: number): DoctorId {
        return new DoctorId(id);
    }
}