import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDateAppointmentException } from "../exceptions/invalid-appointment-date-exception";

export class AppointmentDate implements IValueObject<AppointmentDate>{

    private readonly date: Date;

    get Date() { return this.date; }

    private constructor(date: Date) {

        let hoy: Date = new Date();

        if (!date || date < hoy) {
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
