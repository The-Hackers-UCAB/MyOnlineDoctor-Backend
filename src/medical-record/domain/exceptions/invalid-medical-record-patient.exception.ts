import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordPatientException extends DomainException{
    constructor(){ super("ID del paciente del Medical Record inválida."); }
}