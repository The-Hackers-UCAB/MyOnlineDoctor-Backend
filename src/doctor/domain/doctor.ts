import { AggregateRoot } from "../../core/domain/aggregates/aggregate-root";
import { DomainEvent } from "../../core/domain/domain-events/domain-event";
import { DoctorCreated as DoctorCreated } from "./events/doctor-created.event";
import { InvalidDoctorException } from "./exceptions/invalid-doctor.exception";
import { DoctorId } from "./value-objects/doctor-id";
import { DoctorNames } from "./value-objects/doctor-names";

export class Doctor extends AggregateRoot<DoctorId>{
    //Propiedades.
    private names: DoctorNames;


    //Getters.
    get Names() { return this.names; }


    //Constructor.
    protected constructor(id: DoctorId, names: DoctorNames) {
        const doctorCreated = DoctorCreated.create(id, names);
        super(id, doctorCreated);
    }


    //Asignador de estados.
    protected when(event: DomainEvent): void {
        switch (event.constructor) {
            case DoctorCreated:
                const doctorCreated: DoctorCreated = event as DoctorCreated;
                this.names = doctorCreated.names;
                break;
            default:
                throw new Error("Event not implemented.");
        }
    }


    //Validador de estados.
    protected ensureValidState(): void {
        if (!this.names) {
            throw new InvalidDoctorException();
        }
    }

    static create(id: DoctorId, names: DoctorNames): Doctor {
        return new Doctor(id, names);
    }
}