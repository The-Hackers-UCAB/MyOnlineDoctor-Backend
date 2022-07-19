import { DomainEvent } from "src/core/domain/events/domain-event";
import { AppointmentId } from "../value-objects/appointment-id";
import { AppointmentStatus } from "../value-objects/appointment-status";
import { AppointmentStatusEnum } from "../value-objects/appointment-status.enum";


export class AppointmentIniciated extends DomainEvent {
    protected constructor(
        public id: AppointmentId,
        public status: AppointmentStatus,
    ) {
        super();
    }

    static create(id: AppointmentId): AppointmentIniciated {
        return new AppointmentIniciated(id, AppointmentStatus.create(AppointmentStatusEnum.INICIATED));
    }
}