
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidStatusAppointmentException } from "../exceptions/invalid-appointment-status-exception";
import { AppointmentStatusEnum } from "./appointment-status.enum";


export class AppointmentStatus implements IValueObject<AppointmentStatus>{

    private readonly status: AppointmentStatusEnum;

    get value() {
        return this.status;
    }

    private constructor(status: AppointmentStatusEnum) {
        if (Object.values(AppointmentStatusEnum).includes(status)) {
            this.status = status;
        } else {
            throw new InvalidStatusAppointmentException();
        }
    }

    equals(other: AppointmentStatus): boolean {
        return this.status == other.status;
    }

    static create(status: AppointmentStatusEnum): AppointmentStatus {
        return new AppointmentStatus(status);
    }

}