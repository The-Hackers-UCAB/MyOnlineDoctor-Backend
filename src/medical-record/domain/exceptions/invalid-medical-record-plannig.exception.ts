import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordPlannigException extends DomainException{
    constructor(){ super("Planificación del Medical Record inválida."); }
}