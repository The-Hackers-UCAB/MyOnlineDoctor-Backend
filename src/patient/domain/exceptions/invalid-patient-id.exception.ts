import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientIdException extends DomainException {
    constructor() { super("ID del paciente inválido."); }
}