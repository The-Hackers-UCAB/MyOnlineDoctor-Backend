import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientBackgroundException extends DomainException {
    constructor() { super("Antecedentes del paciente inválidos."); }
}