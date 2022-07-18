import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordException extends DomainException {
    constructor() { super("Medical Record inválido."); }
}