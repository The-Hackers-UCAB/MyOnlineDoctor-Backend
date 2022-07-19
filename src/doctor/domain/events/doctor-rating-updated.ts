import { DoctorRating } from "../value-objects/doctor-rating";
import { DomainEvent } from "../../../core/domain/events/domain-event";
import { DoctorId } from "../value-objects/doctor-id";


export class DoctorRatingUpdated extends DomainEvent {

    protected constructor(
        public id: DoctorId,
        public rating: DoctorRating,
    ) {
        super();
    }

    static create(id: DoctorId, rating: DoctorRating): DoctorRatingUpdated {
        return new DoctorRatingUpdated(id, rating);
    }
}