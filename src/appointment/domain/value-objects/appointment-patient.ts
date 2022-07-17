import { PatientId } from "../../../patient/domain/value-objects/patient-id";
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientAppointmentException } from "../exceptions/invalid-appointment-patient-exception";

export class AppointmentPatient implements IValueObject<AppointmentPatient>{

    private readonly id: PatientId;

    get value() {
        return this.id;
    }

    private constructor(id: PatientId) {
        if (id) {
            this.id = id
        } else {
            throw new InvalidPatientAppointmentException();
        }
    }

    equals(other: AppointmentPatient): boolean {
        return this.id.equals(other.id);
    }

    static create(id: PatientId): AppointmentPatient {
        return new AppointmentPatient(id);
    }

}