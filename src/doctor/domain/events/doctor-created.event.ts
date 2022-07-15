import { DomainEvent } from "../../../core/domain/domain-events/domain-event";
import { DoctorId } from "../value-objects/doctor-id";
import { DoctorNames } from "../value-objects/doctor-names";

export class DoctorCreated extends DomainEvent {
    protected constructor(
        public id: DoctorId,
        public names: DoctorNames
    ) {
        super();
    }

    static create(id: DoctorId, names: DoctorNames): DoctorCreated {
        return new DoctorCreated(id, names);
    }
}