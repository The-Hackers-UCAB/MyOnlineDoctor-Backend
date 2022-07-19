import { DomainEvent } from "src/core/domain/events/domain-event";
import { AppointmentId } from "../value-objects/appointment-id";
import { AppointmentStatus } from "../value-objects/appointment-status";
import { AppointmentStatusEnum } from "../value-objects/appointment-status.enum";


export class AppointmentInitiated extends DomainEvent {
    protected constructor(
        public id: AppointmentId,
        public status: AppointmentStatus,
    ) {
        super();
    }

    static create(id: AppointmentId): AppointmentInitiated {
        return new AppointmentInitiated(id, AppointmentStatus.create(AppointmentStatusEnum.INICIATED));
    }
}