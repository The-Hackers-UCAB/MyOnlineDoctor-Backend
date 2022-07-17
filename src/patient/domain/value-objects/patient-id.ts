import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientIdException } from "../exceptions/invalid-patient-id.exception";
const UUID_FORMAT = /([0-9]|[a-f]){8,8}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){12,12}/g

export class PatientId implements IValueObject<PatientId> {
    private readonly id: string;

    get Value() { return this.id; }

    private constructor(id: string) {
        if (id && id.match(UUID_FORMAT)) {
            this.id = id;
        }
        else {
            throw new InvalidPatientIdException();
        }
    }

    equals(other: PatientId): boolean {
        return this.id == other.id;
    }

    static create(id: string): PatientId {
        return new PatientId(id);
    }
}