import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordDoctorException extends DomainException{
    constructor(){ super("Doctor del Medical Record inválido."); }
}