import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientAllergiesException extends DomainException {
    constructor() { super("Alergias del paciente inválidas."); }
}