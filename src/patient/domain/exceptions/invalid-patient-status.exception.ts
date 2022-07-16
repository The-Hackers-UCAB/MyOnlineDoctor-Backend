import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientStatusException extends DomainException {
    constructor() { super("Estado del paciente inválido."); }
}