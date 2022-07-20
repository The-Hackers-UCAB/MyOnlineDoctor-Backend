import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientBackgroundException } from "../exceptions/invalid-patient-background.exception";


export class PatientBackground implements IValueObject<PatientBackground> {
    private readonly background: string;

    get Value() { return this.background; }

    private constructor(background: string) {
        if (background) {
            this.background = background;
        }
        else {
            throw new InvalidPatientBackgroundException();
        }
    }

    equals(other: PatientBackground): boolean {
        return this.background == other.background;
    }

    static create(background: string): PatientBackground {
        return new PatientBackground(background);
    }
}