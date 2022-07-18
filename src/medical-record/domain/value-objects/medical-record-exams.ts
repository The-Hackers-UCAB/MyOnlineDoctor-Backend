import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordExamsException } from "../exceptions/invalid-medical-record-exams.exception";

export class MedicalRecordExams implements IValueObject<MedicalRecordExams>{
    
    private readonly exams: string;

    get Value(){ 
        return this.exams; 
    }

    private constructor(exams: string){
        if(exams){
            this.exams = exams;
        }else{
            throw new InvalidMedicalRecordExamsException();
        }
    }

    equals(other: MedicalRecordExams): boolean {
        return this.exams === other.exams;
    }

    static create(exams: string): MedicalRecordExams{
        return new MedicalRecordExams(exams);
    }
}