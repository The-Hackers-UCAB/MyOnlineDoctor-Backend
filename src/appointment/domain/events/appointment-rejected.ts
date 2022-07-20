import { DomainEvent } from "../../../core/domain/events/domain-event";
import { AppointmentId } from "../value-objects/appointment-id";
import { AppointmentStatus } from "../value-objects/appointment-status";
import { AppointmentStatusEnum } from "../value-objects/appointment-status.enum";

export class AppointmentRejected extends DomainEvent {
    protected constructor(
        public id: AppointmentId,
        public status: AppointmentStatus
    ) {
        super();
    }

    static create(id: AppointmentId): AppointmentRejected {
        return new AppointmentRejected(id, AppointmentStatus.create(AppointmentStatusEnum.REJECTED));
    }
}