import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDescriptionAppointmentException } from "../exceptions/invalid-appointment-description-exception";

export class AppointmentDescription implements IValueObject<AppointmentDescription>{

    private readonly description: string;

    get Description() { return this.description; }

    private constructor(description: string) {

        if (!description || description.length < 5) {
            throw new InvalidDescriptionAppointmentException();

        } else {
            this.description = description;
        }

    }

    equals(other: AppointmentDescription): boolean {
        return this.description == other.description;
    }

    static create(description: string): AppointmentDescription {
        return new AppointmentDescription(description);
    }
}
