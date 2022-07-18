import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDateAppointmentException } from "../exceptions/invalid-appointment-date-exception";

export class AppointmentDate implements IValueObject<AppointmentDate>{

    private readonly date: Date;

    get Value() { return this.date; }

    private constructor(date: Date) {
        if (date === undefined) {
            throw new InvalidDateAppointmentException();

        } else {
            this.date = date;
        }
    }

    equals(other: AppointmentDate): boolean {
        return this.date == other.date;
    }

    static create(date: Date): AppointmentDate {
        return new AppointmentDate(date);
    }
}
