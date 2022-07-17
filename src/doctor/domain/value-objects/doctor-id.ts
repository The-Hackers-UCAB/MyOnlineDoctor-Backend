import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorIdException } from "../exceptions/invalid-doctor-id.exception";
const UUID_FORMAT = /([0-9]|[a-f]){8,8}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){12,12}/g

export class DoctorId implements IValueObject<DoctorId>{
    private readonly id: string;

    get Value() { return this.id; }

    private constructor(id: string) {
        if (id && id.match(UUID_FORMAT)) {
            this.id = id;
        }
        else {
            throw new InvalidDoctorIdException();
        }
    }

    equals(other: DoctorId): boolean {
        return this.id == other.id;
    }

    static create(id: string): DoctorId {
        return new DoctorId(id);
    }
}