import { AggregateRoot } from "../../core/domain/aggregates/aggregate-root";
import { DomainEvent } from "../../core/domain/events/domain-event";
import { AppointmentCreated } from "./events/appointment-created";
import { AppointmentScheduled } from "./events/appointment-scheduled";
import { InvalidAppointmentException } from "./exceptions/invalid-appointment-exception";
import { AppointmentDate } from "./value-objects/appointment-date";
import { AppointmentDescription } from "./value-objects/appointment-description";
import { AppointmentDoctor } from "./value-objects/appointment-doctor";
import { AppointmentDuration } from "./value-objects/appointment-duration";
import { AppointmentId } from "./value-objects/appointment-id";
import { AppointmentPatient } from "./value-objects/appointment-patient";
import { AppointmentStatus } from "./value-objects/appointment-status";
import { AppointmentStatusEnum } from "./value-objects/appointment-status.enum";
import { AppointmentType } from "./value-objects/appointment-type";

export class Appointment extends AggregateRoot<AppointmentId>{

    // Propiedades
    private date: AppointmentDate;
    private description: AppointmentDescription;
    private duration: AppointmentDuration;
    private status: AppointmentStatus;
    private type: AppointmentType;
    private patient: AppointmentPatient;
    private doctor: AppointmentDoctor;

    // Getters
    get Date() { return this.date; }
    get Description() { return this.description; }
    get Duration() { return this.duration; }
    get Status() { return this.status; }
    get Type() { return this.type; }
    get Patient() { return this.patient; }
    get Doctor() { return this.doctor; }

    // Constructor
    protected constructor(id: AppointmentId, date: AppointmentDate, description: AppointmentDescription, duration: AppointmentDuration, status: AppointmentStatus, type: AppointmentType, patient: AppointmentPatient, doctor: AppointmentDoctor) {
        const appointmentCreated = AppointmentCreated.create(
            id,
            date,
            description,
            duration,
            status,
            type,
            patient,
            doctor)
        super(id, appointmentCreated);
    }


    //Programar cita.
    public scheduleAppointment(date: AppointmentDate, duration: AppointmentDuration) {
        this.apply(AppointmentScheduled.create(this.Id, date, duration));
    }

    //Asignador de estados.
    protected when(event: DomainEvent): void {
        switch (event.constructor) {
            case AppointmentCreated:
                const appointmentCreated: AppointmentCreated = event as AppointmentCreated;
                this.date = appointmentCreated.date;
                this.description = appointmentCreated.description;
                this.duration = appointmentCreated.duration;
                this.status = appointmentCreated.status;
                this.type = appointmentCreated.type;
                this.patient = appointmentCreated.patient;
                this.doctor = appointmentCreated.doctor;
                break;
            case AppointmentScheduled:
                const appointmentScheduled: AppointmentScheduled = event as AppointmentScheduled;
                this.date = appointmentScheduled.date;
                this.duration = appointmentScheduled.duration;
                this.status = appointmentScheduled.status;
                break;
            default:
                throw new Error("Event not implemented.");
        }
    }

    //Validador de estados.
    protected ensureValidState(): void {
        if (
            ((this.status.Value == AppointmentStatusEnum.CANCELED || this.status.Value == AppointmentStatusEnum.COMPLETED || this.status.Value == AppointmentStatusEnum.SCHEDULED) && !this.date.Value) ||
            ((this.status.Value == AppointmentStatusEnum.CANCELED || this.status.Value == AppointmentStatusEnum.COMPLETED || this.status.Value == AppointmentStatusEnum.SCHEDULED) && !this.duration.Value) ||
            !this.description ||
            !this.status ||
            !this.type ||
            !this.patient ||
            !this.doctor
        ) {
            throw new InvalidAppointmentException();
        }
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
    ): Appointment {
        return new Appointment(
            id,
            date,
            description,
            duration,
            status,
            type,
            patient,
            doctor
        );
    }
}