import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidPatientPhoneNumberException extends DomainException {
    constructor() { super("Número de teléfono del paciente inválido."); }
}