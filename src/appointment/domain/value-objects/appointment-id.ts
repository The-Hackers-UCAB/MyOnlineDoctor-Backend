/* eslint-disable prettier/prettier */
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidIdAppointmentException } from "../exceptions/invalid-appointment-id-exception";

export class AppointmentId implements IValueObject<AppointmentId>{

    private readonly id: number;

    get value() {
        return this.id;
    }

    private constructor(id: number) {
        if (id) {
            this.id = id;
        } else {
            throw new InvalidIdAppointmentException();
        }
    }

    equals(other: AppointmentId): boolean {
        return this.id == other.id;
    }

    static create(id: number): AppointmentId {
        return new AppointmentId(id);
    }
}