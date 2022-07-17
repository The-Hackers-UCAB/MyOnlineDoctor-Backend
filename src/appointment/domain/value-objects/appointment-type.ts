
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidTypeAppointmentException } from "../exceptions/invalid-appointment-type-exception";
import { AppointmentTypeEnum } from "./appointment-type.enum";


export class AppointmentType implements IValueObject<AppointmentType>{

    private readonly type: AppointmentTypeEnum;

    get value() {
        return this.type;
    }

    private constructor(type: AppointmentTypeEnum) {
        if (Object.values(AppointmentTypeEnum).includes(type)) {
            this.type = type;
        } else {
            throw new InvalidTypeAppointmentException();
        }
    }

    equals(other: AppointmentType): boolean {
        return this.type == other.type;
    }

    static create(type: AppointmentTypeEnum): AppointmentType {
        return new AppointmentType(type);
    }

}