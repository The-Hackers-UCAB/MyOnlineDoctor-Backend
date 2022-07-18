import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordDoctorException } from "../exceptions/invalid-medical-record-doctor.exception";
import { DoctorId } from "src/doctor/domain/value-objects/doctor-id";
import { DoctorSpecialty } from "src/doctor/domain/value-objects/doctor-specialty";

export class MedicalRecordDoctor implements IValueObject<MedicalRecordDoctor>{

    private readonly id: DoctorId;
    private readonly specialty: DoctorSpecialty;

    get Id(){
        return this.Id;
    }

    get Specialty(){
        return this.specialty;
    }

    private constructor(id: DoctorId, specialty: DoctorSpecialty){
        if(id && specialty){
            this.id = id;
            this.specialty = specialty;
        }else{
            throw new InvalidMedicalRecordDoctorException();
        }
    }

    equals(other: MedicalRecordDoctor): boolean {
        return this.id == other.id && this.specialty === other.specialty;
    }

    static create(id: DoctorId, specialty: DoctorSpecialty): MedicalRecordDoctor{
        return new MedicalRecordDoctor(id,specialty);
    }
}