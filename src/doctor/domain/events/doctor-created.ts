import { DomainEvent } from "../../../core/domain/domain-events/domain-event";
import { DoctorGender } from "../value-objects/doctor-gender";
import { DoctorId } from "../value-objects/doctor-id";
import { DoctorLocation } from "../value-objects/doctor-location";
import { DoctorNames } from "../value-objects/doctor-names";
import { DoctorRating } from "../value-objects/doctor-rating";
import { DoctorSpecialty } from "../value-objects/doctor-specialty";
import { DoctorStatus } from "../value-objects/doctor-status";
import { DoctorSurnames } from "../value-objects/doctor-surnames";

export class DoctorCreated extends DomainEvent {
    protected constructor(
        public id: DoctorId,
        public names: DoctorNames,
        public surnames: DoctorSurnames,
        public location: DoctorLocation,
        public rating: DoctorRating,
        public gender: DoctorGender,
        public status: DoctorStatus,
        public specialties: DoctorSpecialty[]
    ) {
        super();
    }

    static create(id: DoctorId, names: DoctorNames, surnames: DoctorSurnames, location: DoctorLocation, rating: DoctorRating, gender: DoctorGender, status: DoctorStatus, specialties: DoctorSpecialty[]): DoctorCreated {
        return new DoctorCreated(id, names, surnames, location, rating, gender, status, specialties);
    }
}