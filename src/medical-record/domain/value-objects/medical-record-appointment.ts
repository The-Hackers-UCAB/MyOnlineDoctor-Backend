import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordAppointmentException } from "../exceptions/invalid-medical-record-appointment.exception";
import { AppointmentId } from "src/appointment/domain/value-objects/appointment-id";

export class MedicalRecordAppointment implements IValueObject<MedicalRecordAppointment>{

    private readonly id: AppointmentId;

    get Id(){
        return this.id;
    }

    private constructor(id: AppointmentId){
        if(id){
            this.id = id;
        }else{
            throw new InvalidMedicalRecordAppointmentException();
        }
    }

    equals(other: MedicalRecordAppointment): boolean {
        return this.id == other.id;
    }

    static create(id: AppointmentId): MedicalRecordAppointment{
        return new MedicalRecordAppointment(id);
    }
}