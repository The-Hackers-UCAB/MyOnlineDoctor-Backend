import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { InvalidPatientBirthdateException } from "../exceptions/invalid-patient-birthdate.exception";


export class PatientBirthdate implements IValueObject<PatientBirthdate> {
    
        private readonly birthdate: Date;
    
        get Value() { return this.birthdate; }
    
        private constructor(birthdate: Date) {
            if (birthdate) {
                this.birthdate = birthdate;
            }
            else {
                throw new InvalidPatientBirthdateException();
            }
        }
    
        equals(other: PatientBirthdate): boolean {
            return this.birthdate == other.birthdate;
        }
    
        static create(birthdate: Date): PatientBirthdate {
            return new PatientBirthdate(birthdate);
        }
    }