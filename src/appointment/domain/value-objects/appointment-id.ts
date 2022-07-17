/* eslint-disable prettier/prettier */
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidIdAppointmentException } from "../exceptions/invalid-appointment-id-exception";
const UUID_FORMAT = /([0-9]|[a-f]){8,8}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){4,4}-([0-9]|[a-f]){12,12}/g
export class AppointmentId implements IValueObject<AppointmentId>{

    private readonly id: string;

    get value() {
        return this.id;
    }

    private constructor(id: string) {
        if (id && id.match(UUID_FORMAT)) {
            this.id = id;
        } else {
            throw new InvalidIdAppointmentException();
        }
    }

    equals(other: AppointmentId): boolean {
        return this.id == other.id;
    }

    static create(id: string): AppointmentId {
        return new AppointmentId(id);
    }
}
