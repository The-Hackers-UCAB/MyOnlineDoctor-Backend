import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorAppointmentException } from "../exceptions/invalid-appointment-doctor-exception";
import { DoctorSpecialty } from "../../../doctor/domain/value-objects/doctor-specialty";

export class AppointmentDoctor implements IValueObject<AppointmentDoctor>{

    private readonly id: DoctorId;
    private readonly specialty: DoctorSpecialty;
    private readonly rating?: number;

    get Id() {
        return this.id;
    }

    get Specialty() {
        return this.specialty;
    }

    get Rating() {
        return this.rating;
    }

    private constructor(id: DoctorId, specialty: DoctorSpecialty, rating?: number) {
        if (id && specialty && (!rating || (rating >= 0 && rating <= 5))) {
            this.id = id;
            this.specialty = specialty;
            this.rating = rating;
        } else {
            throw new InvalidDoctorAppointmentException();
        }
    }

    equals(other: AppointmentDoctor): boolean {
        return this.id.equals(other.id) && this.specialty.equals(other.specialty) && this.rating == other.rating;
    }

    static create(id: DoctorId, specialty: DoctorSpecialty, rating?: number): AppointmentDoctor {
        return new AppointmentDoctor(id, specialty, rating);
    }
}