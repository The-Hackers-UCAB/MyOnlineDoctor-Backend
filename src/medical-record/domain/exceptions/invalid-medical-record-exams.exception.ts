import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordExamsException extends DomainException{
    constructor(){ super("Exámenes del Medical Record inválidos."); }
}