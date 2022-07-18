import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordDateException } from "../exceptions/invalid-medical-record-date.exception";

export class MedicalRecordDate implements IValueObject<MedicalRecordDate>{
    
    private readonly date: Date;

    get Value(){ 
        return this.date; 
    }

    private constructor(date: Date){
        const today = new Date();
        if(date <= today){
            this.date = date;
        }else{
            throw new InvalidMedicalRecordDateException();
        }
    }

    equals(other: MedicalRecordDate): boolean {
        return this.date == other.date;
    }

    static create(date: Date): MedicalRecordDate{
        return new MedicalRecordDate(date);
    }
}