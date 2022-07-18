import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDurationAppointmentException } from "../exceptions/invalid-appointment-duration-exception";

export class AppointmentDuration implements IValueObject<AppointmentDuration>{

    private readonly hours: number;

    get Value() { return this.hours; }

    private constructor(hours: number) {
        if (hours === undefined || (hours && (hours % 1 != 0 || hours <= 0))) {

            throw new InvalidDurationAppointmentException();
        } else {
            this.hours = hours;
        }
    }



    equals(other: AppointmentDuration): boolean {
        return this.hours == other.hours;
    }

    static create(hours: number): AppointmentDuration {
        return new AppointmentDuration(hours);
    }
}
