import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorStatusException } from "../exceptions/invalid-doctor-status.exception";
import { DoctorStatusEnum } from "./doctor-status.enum";

export class DoctorStatus implements IValueObject<DoctorStatus>{
    private readonly status: DoctorStatusEnum;

    get Value() { return this.status; }

    private constructor(status: DoctorStatusEnum) {
        if (Object.values(DoctorStatusEnum).includes(status)) {
            this.status = status;
        }
        else {
            throw new InvalidDoctorStatusException();
        }
    }

    equals(other: DoctorStatus): boolean {
        return this.status == other.status;
    }

    static create(status: DoctorStatusEnum): DoctorStatus {
        return new DoctorStatus(status);
    }
}