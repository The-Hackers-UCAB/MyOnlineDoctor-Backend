import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientNamesException extends DomainException {
    constructor() { super("Nombres del paciente inválidos."); }
}