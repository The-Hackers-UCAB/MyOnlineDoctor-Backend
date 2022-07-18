import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordDescriptionException extends DomainException{
    constructor(){ super("Descripción del Medical Record inválida."); }
}