import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientException extends DomainException {
    constructor() { super("Paciente inválido."); }
}