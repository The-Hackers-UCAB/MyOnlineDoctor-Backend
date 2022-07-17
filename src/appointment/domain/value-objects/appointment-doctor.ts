import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorAppointmentException } from "../exceptions/invalid-appointment-doctor-exception";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";

export class AppointmentDoctor implements IValueObject<AppointmentDoctor>{

    private readonly id: DoctorId;
    private readonly specialty: DoctorSpecialty;

    get Id() {
        return this.id;
    }

    get Specialty() {
        return this.specialty;
    }

    private constructor(id: DoctorId, specialty: DoctorSpecialty) {
        if (id && specialty) {
            this.id = id;
            this.specialty = specialty;
        } else {
            throw new InvalidDoctorAppointmentException();
        }
    }

    // equals(other: AppointmentDoctor): boolean {
    //     return this.id == other.id && this.specialty == other.specialty;
    // }

    equals(other: AppointmentDoctor): boolean {
        return this.id.equals(other.id) && this.specialty.equals(other.specialty);
    }

    static create(id: DoctorId, specialty: DoctorSpecialty): AppointmentDoctor {
        return new AppointmentDoctor(id, specialty);
    }
}