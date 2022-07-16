import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientHeightException extends DomainException {
    constructor() { super("Altura del paciente inválida."); }
}