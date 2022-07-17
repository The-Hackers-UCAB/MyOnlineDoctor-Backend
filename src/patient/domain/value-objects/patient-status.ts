import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientStatusException } from "../exceptions/invalid-patient-status.exception";
import { PatientStatusEnum } from "./patient-status.enum";

export class PatientStatus implements IValueObject<PatientStatus>{
    private readonly status: PatientStatusEnum;

    get Value() { return this.status; }

    private constructor(status: PatientStatusEnum) {
        if (Object.values(PatientStatusEnum).includes(status)) {
            this.status = status;
        }
        else {
            throw new InvalidPatientStatusException();
        }
    }

    equals(other: PatientStatus): boolean {
        return this.status == other.status;
    }

    static create(status: PatientStatusEnum): PatientStatus {
        return new PatientStatus(status);
    }
}
