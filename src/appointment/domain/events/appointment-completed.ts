import { DomainEvent } from "../../../core/domain/events/domain-event";
import { AppointmentId } from "../value-objects/appointment-id";
import { AppointmentStatus } from "../value-objects/appointment-status";
import { AppointmentStatusEnum } from "../value-objects/appointment-status.enum";



export class AppointmentCompleted extends DomainEvent {
    protected constructor(
        public id: AppointmentId,
        public status: AppointmentStatus,
    ) {
        super();
    }

    static create(id: AppointmentId): AppointmentCompleted {
        return new AppointmentCompleted(id, AppointmentStatus.create(AppointmentStatusEnum.COMPLETED));
    }
}