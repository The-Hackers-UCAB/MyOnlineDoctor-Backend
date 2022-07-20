import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordPlannigException } from "../exceptions/invalid-medical-record-plannig.exception";

export class MedicalRecordPlannig implements IValueObject<MedicalRecordPlannig>{

    private readonly plannig: string;

    get Value() {
        return this.plannig;
    }

    private constructor(plannig: string) {
        if (plannig) {
            this.plannig = plannig;
        } else {
            throw new InvalidMedicalRecordPlannigException();
        }
    }

    equals(other: MedicalRecordPlannig): boolean {
        return this.plannig === other.plannig;
    }

    static create(plannig: string): MedicalRecordPlannig {
        return new MedicalRecordPlannig(plannig);
    }
}
