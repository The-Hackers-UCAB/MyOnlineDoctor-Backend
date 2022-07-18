import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordDiagnosticException } from "../exceptions/invalid-medical-record-diagnostic.exception";

export class MedicalRecordDiagnostic implements IValueObject<MedicalRecordDiagnostic>{
    
    private readonly diagnostic: string;

    get Value(){ 
        return this.diagnostic; 
    }

    private constructor(diagnostic: string){
        if(diagnostic){
            this.diagnostic = diagnostic;
        }else{
            throw new InvalidMedicalRecordDiagnosticException();
        }
    }

    equals(other: MedicalRecordDiagnostic): boolean {
        return this.diagnostic === other.diagnostic;
    }

    static create(diagnostic: string): MedicalRecordDiagnostic{
        return new MedicalRecordDiagnostic(diagnostic);
    }
}