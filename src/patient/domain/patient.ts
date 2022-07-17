import { AggregateRoot } from "../../core/domain/aggregates/aggregate-root";
import { DomainEvent } from "../../core/domain/domain-events/domain-event";
import { PatientCreated as PatientCreated } from "./events/patient-created.event";
import { InvalidPatientException } from "./exceptions/invalid-patient.exception";
import { PatientId } from "./value-objects/patient-id";
import { PatientNames } from "./value-objects/patient-names";
import { PatientSurnames } from "./value-objects/patient-surnames";
import { PatientBirthdate } from "./value-objects/patient-birthdate";
import { PatientAllergies } from "./value-objects/patient-allergies";
import { PatientBackground } from "./value-objects/patient-background";
import { PatientHeight } from "./value-objects/patient-height";
import { PatientPhoneNumber } from "./value-objects/patient-phone-number";
import { PatientWeight } from "./value-objects/patient-weight";
import { PatientSurgeries } from "./value-objects/patient-surgeries";
import { PatientStatus } from "./value-objects/patient-status";
import { PatientGender } from "./value-objects/patient-gender";


export class Patient extends AggregateRoot<PatientId> {

    //Propiedades
    private names: PatientNames;
    private surnames: PatientSurnames;
    private birthdate: PatientBirthdate;
    private allergies: PatientAllergies;
    private background: PatientBackground;
    private height: PatientHeight;
    private phoneNumber: PatientPhoneNumber;
    private status: PatientStatus;
    private weight: PatientWeight;
    private surgeries: PatientSurgeries;
    private gender: PatientGender;

    //getter
    get Names() { return this.names }
    get SurNames() { return this.surnames }
    get BirthDate() { return this.birthdate }
    get Allergies() { return this.allergies }
    get Backgorund() { return this.background }
    get Height() { return this.height }
    get PhoneNumber() { return this.phoneNumber }
    get Status() { return this.status }
    get Weight() { return this.weight }
    get Surgeries() { return this.surgeries }
    get Gender() { return this.gender }

    protected constructor(
        id: PatientId,
        names: PatientNames,
        surnames: PatientSurnames,
        birthdate: PatientBirthdate,
        allergies: PatientAllergies,
        background: PatientBackground,
        height: PatientHeight,
        phoneNumber: PatientPhoneNumber,
        status: PatientStatus,
        weight: PatientWeight,
        surgeries: PatientSurgeries,
        gender: PatientGender
    ) {
        const patientCreated = PatientCreated.create(
            id,
            names,
            surnames,
            birthdate,
            allergies,
            background,
            height,
            phoneNumber,
            status,
            weight,
            surgeries,
            gender
        );
        super(id, patientCreated);
    }

    //asignando estados
    protected when(event: DomainEvent): void {
        switch (event.constructor) {
            case PatientCreated:
                const patientCreated = event as PatientCreated;
                this.names = patientCreated.names;
                this.surnames = patientCreated.surnames;
                this.birthdate = patientCreated.birthdate;
                this.allergies = patientCreated.allergies;
                this.background = patientCreated.background;
                this.height = patientCreated.height;
                this.phoneNumber = patientCreated.phoneNumber;
                this.status = patientCreated.status;
                this.weight = patientCreated.weight;
                this.surgeries = patientCreated.surgeries;
                this.gender = patientCreated.gender;
                break;
            default:
                throw new Error("Event not implemented.");
        }
    }

    //Validar estados
    protected ensureValidState(): void {
        if (!this.Id || !this.names || !this.surnames || !this.birthdate || !this.allergies || !this.background || !this.height || !this.phoneNumber || !this.status || !this.weight || !this.surgeries || !this.gender) {
            throw new InvalidPatientException();
        }
    }

    static create(
        id: PatientId,
        names: PatientNames,
        surnames: PatientSurnames,
        birthdate: PatientBirthdate,
        allergies: PatientAllergies,
        background: PatientBackground,
        height: PatientHeight,
        phoneNumber: PatientPhoneNumber,
        status: PatientStatus,
        weight: PatientWeight,
        surgeries: PatientSurgeries,
        gender: PatientGender
    ): Patient {
        return new Patient(
            id,
            names,
            surnames,
            birthdate,
            allergies,
            background,
            height,
            phoneNumber,
            status,
            weight,
            surgeries,
            gender
        );
    }
}
