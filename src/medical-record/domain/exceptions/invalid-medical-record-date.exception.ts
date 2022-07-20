import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordDateException extends DomainException{
    constructor(){ super("Fecha del Medical Record inválida."); }
}