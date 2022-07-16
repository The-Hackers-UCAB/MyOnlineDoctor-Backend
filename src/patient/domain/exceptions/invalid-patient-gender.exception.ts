import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientGenderException extends DomainException {
    constructor() { super("Género del paciente inválido."); }
}