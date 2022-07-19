import { DomainEvent } from "../../../core/domain/events/domain-event";
import { AppointmentDate } from "../value-objects/appointment-date";
import { AppointmentDuration } from "../value-objects/appointment-duration";
import { AppointmentId } from "../value-objects/appointment-id";
import { AppointmentStatus } from "../value-objects/appointment-status";
import { AppointmentStatusEnum } from "../value-objects/appointment-status.enum";

export class AppointmentScheduled extends DomainEvent {
    protected constructor(
        public id: AppointmentId,
        public date: AppointmentDate,
        public duration: AppointmentDuration,
        public status: AppointmentStatus
    ) {
        super();
    }

    static create(
        id: AppointmentId,
        date: AppointmentDate,
        duration: AppointmentDuration,
    ): AppointmentScheduled {
        return new AppointmentScheduled(id, date, duration, AppointmentStatus.create(AppointmentStatusEnum.SCHEDULED));
    }
}