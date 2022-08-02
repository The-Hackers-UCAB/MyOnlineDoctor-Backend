import { AggregateRoot } from "../../core/domain/aggregates/aggregate-root";
import { InvalidMedicalRecordException } from "./exceptions/invalid-medical-record.exception";
import { MedicalRecordCreated } from "./events/medical-record-created";
import { DomainEvent } from "../../core/domain/events/domain-event";
import { MedicalRecordID } from "./value-objects/medical-record-id";
import { MedicalRecordDate } from "./value-objects/medical-record-date";
import { MedicalRecordDescription } from "./value-objects/medical-record-description";
import { MedicalRecordDiagnostic } from "./value-objects/medical-record-diagnostic";
import { MedicalRecordPatient } from "./value-objects/medical-record-patient";
import { MedicalRecordAppointment } from "./value-objects/medical-record-appointment";
import { MedicalRecordExams } from "./value-objects/medical-record-exams";
import { MedicalRecordRecipe } from "./value-objects/medical-record-recipe";
import { MedicalRecordPlanning } from "./value-objects/medical-record-planning";
import { MedicalRecordDoctor } from "./value-objects/medical-record-doctor";
import { MedicalRecordDescriptionModified } from "./events/medical-record-description-modified";
import { MedicalRecordDiagnosticModified } from "./events/medical-record-diagnostics-modified";
import { MedicalRecordExamsModified } from "./events/medical-record-exams-modified";
import { MedicalRecordRecipeModified } from "./events/medical-record-recipe-modified";
import { MedicalRecordPlanningModified } from "./events/medical-record-planning-modified";

export class MedicalRecord extends AggregateRoot<MedicalRecordID>{

    //Propiedades
    private date: MedicalRecordDate;
    private description: MedicalRecordDescription;
    private diagnostic: MedicalRecordDiagnostic;
    private patient: MedicalRecordPatient;
    private appointment: MedicalRecordAppointment;
    private exams: MedicalRecordExams;
    private recipe: MedicalRecordRecipe;
    private planning: MedicalRecordPlanning;
    private doctor: MedicalRecordDoctor;

    //Getters
    get Date() { return this.date; }
    get Description() { return this.description; }
    get Diagnostic() { return this.diagnostic; }
    get Patient() { return this.patient; }
    get Appointment() { return this.appointment; }
    get Exams() { return this.exams; }
    get Recipe() { return this.recipe; }
    get Planning() { return this.planning; }
    get Doctor() { return this.doctor; }

    //Constructor
    protected constructor(
        id: MedicalRecordID,
        date: MedicalRecordDate,
        description: MedicalRecordDescription,
        diagnostic: MedicalRecordDiagnostic,
        patient: MedicalRecordPatient,
        appointment: MedicalRecordAppointment,
        exams: MedicalRecordExams,
        recipe: MedicalRecordRecipe,
        planning: MedicalRecordPlanning,
        doctor: MedicalRecordDoctor
    ) {
        const medicalRecordCreated = MedicalRecordCreated.create(
            id,
            date,
            description,
            diagnostic,
            patient,
            appointment,
            exams,
            recipe,
            planning,
            doctor
        );
        super(id, medicalRecordCreated);
    }

    //Metodos
    public updateDescription(description: MedicalRecordDescription): void {
        this.apply(MedicalRecordDescriptionModified.create(this.Id, description));
    }

    public updateDiagnostic(diagnostic: MedicalRecordDiagnostic): void {
        this.apply(MedicalRecordDiagnosticModified.create(this.Id, diagnostic));
    }

    public updateExams(exams: MedicalRecordExams): void {
        this.apply(MedicalRecordExamsModified.create(this.Id, exams));
    }

    public updateRecipe(recipe: MedicalRecordRecipe): void {
        this.apply(MedicalRecordRecipeModified.create(this.Id, recipe));
    }

    public updatePlanning(planning: MedicalRecordPlanning): void {
        this.apply(MedicalRecordPlanningModified.create(this.Id, planning));
    }

    //Asignador de estados.
    protected when(event: DomainEvent): void {
        switch (event.constructor) {
            case MedicalRecordCreated:
                const medicalRecordCreated: MedicalRecordCreated = event as MedicalRecordCreated;
                this.date = medicalRecordCreated.date;
                this.description = medicalRecordCreated?.description;
                this.diagnostic = medicalRecordCreated?.diagnostic;
                this.patient = medicalRecordCreated.patient;
                this.appointment = medicalRecordCreated.appointment;
                this.exams = medicalRecordCreated?.exams;
                this.recipe = medicalRecordCreated?.recipe;
                this.planning = medicalRecordCreated?.planning;
                this.doctor = medicalRecordCreated.doctor;
                break;
            case MedicalRecordDescriptionModified:
                const medicalRecordDescriptionModified: MedicalRecordDescriptionModified = event as MedicalRecordDescriptionModified;
                this.description = medicalRecordDescriptionModified.description;
                break;
            case MedicalRecordDiagnosticModified:
                const medicalRecordDiagnosticModified: MedicalRecordDiagnosticModified = event as MedicalRecordDiagnosticModified;
                this.diagnostic = medicalRecordDiagnosticModified.diagnostic;
                break;
            case MedicalRecordExamsModified:
                const medicalRecordExamsModified: MedicalRecordExamsModified = event as MedicalRecordExamsModified;
                this.exams = medicalRecordExamsModified.exams;
                break;
            case MedicalRecordRecipeModified:
                const medicalRecordRecipeModified: MedicalRecordRecipeModified = event as MedicalRecordRecipeModified;
                this.recipe = medicalRecordRecipeModified.recipe;
                break;
            case MedicalRecordPlanningModified:
                const medicalRecordPlanningModified: MedicalRecordPlanningModified = event as MedicalRecordPlanningModified;
                this.planning = medicalRecordPlanningModified.planning;
            default:
                throw new Error("Event not implemented.");
        }
    }

    //Validar estados.
    protected ensureValidState(): void {
        if (
            !this.date ||
            !this.patient ||
            !this.appointment ||
            !this.doctor
        ) {
            throw new InvalidMedicalRecordException();
        }
    }

    static create(
        id: MedicalRecordID,
        date: MedicalRecordDate,
        description: MedicalRecordDescription,
        diagnostic: MedicalRecordDiagnostic,
        patient: MedicalRecordPatient,
        appointment: MedicalRecordAppointment,
        exams: MedicalRecordExams,
        recipe: MedicalRecordRecipe,
        planning: MedicalRecordPlanning,
        doctor: MedicalRecordDoctor
    ): MedicalRecord {
        return new MedicalRecord(id, date, description, diagnostic, patient, appointment, exams, recipe, planning, doctor);
    }
}