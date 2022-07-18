import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordAppointmentException extends DomainException{
    constructor(){ super("ID de la cita del Medical Record inválida."); }
}