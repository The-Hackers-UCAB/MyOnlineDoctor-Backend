import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientBirthdateException extends DomainException {
    constructor() { super("Fecha de nacimiento del paciente inválida."); }
}