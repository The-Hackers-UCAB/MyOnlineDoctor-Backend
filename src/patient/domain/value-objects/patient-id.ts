import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientIdException } from "../exceptions/invalid-patient-id.exception";


export class PatientId implements IValueObject<PatientId> {

    private readonly id: number;

    get value() { return this.id; }

    private constructor(id: number) {
        if (id) {
            this.id = id;
        }
        else {
            throw new InvalidPatientIdException();
        }
    }

    equals(other: PatientId): boolean {
        return this.id == other.id;
    }

    static create(id: number): PatientId {
        return new PatientId(id);
    }
}