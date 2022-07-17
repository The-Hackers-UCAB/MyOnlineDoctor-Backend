import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidPatientSurnamesException } from "../exceptions/invalid-patient-surnames.exception";

export class PatientSurnames implements IValueObject<PatientSurnames> {
    private readonly firstSurname: string;
    private readonly secondSurname?: string;

    get FirstSurname() { return this.firstSurname; }
    get SecondSurname() { return this.secondSurname; }

    private constructor(firstSurname: string, secondSurname: string) {
        let error: boolean = false;
        if (!firstSurname || firstSurname.length < 3) {
            error = true;
        }
        if (secondSurname && secondSurname.length < 3) {
            error = true;
        }
        if (error) {
            throw new InvalidPatientSurnamesException();
        }
        else {
            this.firstSurname = firstSurname;
            this.secondSurname = secondSurname;
        }
    }

    equals(other: PatientSurnames): boolean {
        return this.firstSurname == other.firstSurname && this.secondSurname == other.secondSurname
    }

    static create(firstSurname: string, secondSurname?: string): PatientSurnames {
        return new PatientSurnames(firstSurname, secondSurname);
    }
}