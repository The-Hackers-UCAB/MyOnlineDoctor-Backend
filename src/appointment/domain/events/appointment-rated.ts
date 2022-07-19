import { DomainEvent } from "src/core/domain/events/domain-event";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorRating } from "src/doctor/domain/value-objects/doctor-rating";
import { AppointmentId } from "../value-objects/appointment-id";


export class AppointmentRated extends DomainEvent {
    constructor(
        public readonly id: AppointmentId,
        public readonly doctorRating: DoctorRating,
        public readonly doctorId: DoctorId
    ) {
        super();
    }

    static create(id: AppointmentId,  id_doctor: DoctorId,doctorRating: DoctorRating): AppointmentRated {
        return new AppointmentRated(id, doctorRating,id_doctor);

    }
}