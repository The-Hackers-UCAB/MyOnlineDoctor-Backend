import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordIdException } from "../exceptions/invalid-medical-record-id.exception";
const UUID_FORMAT = /([0-9]|[a-f]){8,8}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){12,12}/g

export class MedicalRecordID implements IValueObject<MedicalRecordID>{

    private readonly id: string;

    get Value() { return this.id; }

    private constructor(id: string) {
        if (id && id.match(UUID_FORMAT)) {
            this.id = id;
        } else {
            throw new InvalidMedicalRecordIdException();
        }
    }

    equals(other: MedicalRecordID): boolean {
        return this.id == other.id;
    }

    static create(id: string): MedicalRecordID {
        return new MedicalRecordID(id);
    }

}