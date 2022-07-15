import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorException extends DomainException {
    constructor() { super("Doctor inválido."); }
}