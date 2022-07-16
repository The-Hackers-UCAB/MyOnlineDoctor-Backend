import { AggregateRoot } from "../../core/domain/aggregates/aggregate-root";
import { DomainEvent } from "../../core/domain/domain-events/domain-event";
import { DoctorCreated as DoctorCreated } from "./events/doctor-created.event";
import { InvalidDoctorException } from "./exceptions/invalid-doctor.exception";
import { DoctorGender } from "./value-objects/doctor-gender.enum";
import { DoctorId } from "./value-objects/doctor-id";
import { DoctorLocation } from "./value-objects/doctor-location";
import { DoctorNames } from "./value-objects/doctor-names";
import { DoctorRating } from "./value-objects/doctor-rating";
import { DoctorSpecialty } from "./value-objects/doctor-specialty.enum";
import { DoctorStatus } from "./value-objects/doctor-status.enum";
import { DoctorSurnames } from "./value-objects/doctor-surnames";

export class Doctor extends AggregateRoot<DoctorId>{
    //Propiedades.
    private names: DoctorNames;
    private surnames: DoctorSurnames;
    private location: DoctorLocation;
    private rating: DoctorRating;
    private gender: DoctorGender;
    private status: DoctorStatus;
    private specialties: DoctorSpecialty[];

    //Getters.
    get Names() { return this.names; }
    get Surnames() { return this.surnames; }
    get Location() { return this.location; }
    get Rating() { return this.rating; }
    get Gender() { return this.gender; }
    get Specialties() { return this.specialties }


    //Constructor.
    protected constructor(id: DoctorId, names: DoctorNames, surnames: DoctorSurnames, location: DoctorLocation, rating: DoctorRating, gender: DoctorGender, status: DoctorStatus, specialties: DoctorSpecialty[]) {
        const doctorCreated = DoctorCreated.create(id, names, surnames, location, rating, gender, status, specialties);
        super(id, doctorCreated);
    }


    //Asignador de estados.
    protected when(event: DomainEvent): void {
        switch (event.constructor) {
            case DoctorCreated:
                const doctorCreated: DoctorCreated = event as DoctorCreated;
                this.names = doctorCreated.names;
                this.surnames = doctorCreated.surnames;
                this.location = doctorCreated.location;
                this.rating = doctorCreated.rating;
                this.gender = doctorCreated.gender;
                this.status = doctorCreated.status;
                this.specialties = doctorCreated.specialties;
                break;
            default:
                throw new Error("Event not implemented.");
        }
    }


    //Validador de estados.
    protected ensureValidState(): void {
        if (!this.names || !this.surnames || !this.location || !this.rating || !this.gender || !this.status || !this.specialties || this.specialties.length == 0) {
            throw new InvalidDoctorException();
        }
    }

    static create(id: DoctorId, names: DoctorNames, surnames: DoctorSurnames, location: DoctorLocation, rating: DoctorRating, gender: DoctorGender, status: DoctorStatus, specialties: DoctorSpecialty[]): Doctor {
        return new Doctor(id, names, surnames, location, rating, gender, status, specialties);
    }
}