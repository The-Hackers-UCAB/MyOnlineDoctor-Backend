import { DomainEvent } from "../../../core/domain/events/domain-event";
import { DoctorId } from "../../../doctor/domain/value-objects/doctor-id";
import { DoctorRating } from "../../../doctor/domain/value-objects/doctor-rating";
import { AppointmentId } from "../value-objects/appointment-id";

export class AppointmentRated extends DomainEvent {
    constructor(
        public readonly id: AppointmentId,
        public readonly doctorId: DoctorId,
        public readonly doctorRating: DoctorRating
    ) {
        super();
    }

    static create(id: AppointmentId, id_doctor: DoctorId, doctorRating: DoctorRating): AppointmentRated {
        return new AppointmentRated(id, id_doctor, doctorRating);
    }
}