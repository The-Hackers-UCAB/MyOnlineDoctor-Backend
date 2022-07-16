import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientSurgeriesException extends DomainException {
    constructor() { super("Cirugías del paciente inválidas."); }
}