import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientSurnamesException extends DomainException {
    constructor() { super("Apellidos del paciente inválidos."); }
}