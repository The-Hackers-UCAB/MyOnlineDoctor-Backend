import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordDiagnosticException extends DomainException{
    constructor(){ super("Diagnóstico del Medical Record inválido."); }
}