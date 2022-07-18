import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordIdException extends DomainException{
    constructor(){ super("ID del Medical Record inválido."); }
}