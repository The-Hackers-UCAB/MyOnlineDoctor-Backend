import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidDoctorSurnamesException } from "../exceptions/invalid-doctor-surnames.exception";

export class DoctorSurnames implements IValueObject<DoctorSurnames>{
    private readonly firstSurname: string;
    private readonly secondSurname?: string;

    get FirstSurname() { return this.firstSurname; }
    get SecondSurname() { return this.secondSurname; }

    private constructor(firstSurname: string, secondSurname?: string) {
        let error: boolean = false;

        if (!firstSurname || firstSurname.length < 3) {
            error = true;
        }

        if (secondSurname && secondSurname.length < 3) {
            error = true;
        }


        if (error) {
            throw new InvalidDoctorSurnamesException();
        }
        else {
            this.firstSurname = firstSurname;
            this.secondSurname = secondSurname;
        }
    }

    equals(other: DoctorSurnames): boolean {
        return this.firstSurname == other.firstSurname && this.secondSurname == other.secondSurname
    }

    static create(firstSurname: string, secondSurname?: string): DoctorSurnames {
        return new DoctorSurnames(firstSurname, secondSurname);
    }
}