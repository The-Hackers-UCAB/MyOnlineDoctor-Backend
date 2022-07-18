import { DomainEvent } from "../../../core/domain/events/domain-event";
import { AppointmentDate } from "../value-objects/appointment-date";
import { AppointmentDescription } from "../value-objects/appointment-description";
import { AppointmentDoctor } from "../value-objects/appointment-doctor";
import { AppointmentDuration } from "../value-objects/appointment-duration";
import { AppointmentId } from "../value-objects/appointment-id";
import { AppointmentPatient } from "../value-objects/appointment-patient";
import { AppointmentStatus } from "../value-objects/appointment-status";
import { AppointmentType } from "../value-objects/appointment-type";


export class AppointmentCreated extends DomainEvent {
    protected constructor(
        public id: AppointmentId,
        public date: AppointmentDate,
        public description: AppointmentDescription,
        public duration: AppointmentDuration,
        public status: AppointmentStatus,
        public type: AppointmentType,
        public patient: AppointmentPatient,
        public doctor: AppointmentDoctor
    ) {
        super();
    }

    static create(
        id: AppointmentId,
        date: AppointmentDate,
        description: AppointmentDescription,
        duration: AppointmentDuration,
        status: AppointmentStatus,
        type: AppointmentType,
        patient: AppointmentPatient,
        doctor: AppointmentDoctor
    ): AppointmentCreated {
        return new AppointmentCreated(id, date, description, duration, status, type, patient, doctor);
    }
}