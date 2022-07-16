import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientWeightException extends DomainException {
    constructor() { super("Peso del paciente inválido."); }
}