import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordPatientException } from "../exceptions/invalid-medical-record-patient.exception";
import { PatientId } from "src/patient/domain/value-objects/patient-id";

export class MedicalRecordPatient implements IValueObject<MedicalRecordPatient>{

    private readonly id: PatientId;

    get Id(){
        return this.id
    }

    private constructor(id: PatientId){
        if(id){
            this.id = id;
        }else{
            throw new InvalidMedicalRecordPatientException();
        }
    }

    equals(other: MedicalRecordPatient): boolean {
        return this.id == other.id;
    }

    static create(id: PatientId): MedicalRecordPatient{
        return new MedicalRecordPatient(id);
    }
}