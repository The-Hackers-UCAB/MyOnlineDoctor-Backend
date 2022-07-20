import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordDescriptionException } from "../exceptions/invalid-medical-record-description.exception";

export class MedicalRecordDescription implements IValueObject<MedicalRecordDescription>{

    private readonly description: string;

    get Value() {
        return this.description;
    }

    private constructor(description: string) {
        if (description) {
            this.description = description;
        } else {
            throw new InvalidMedicalRecordDescriptionException();
        }
    }

    equals(other: MedicalRecordDescription): boolean {
        return this.description === other.description;
    }

    static create(description: string): MedicalRecordDescription {
        return new MedicalRecordDescription(description);
    }
}