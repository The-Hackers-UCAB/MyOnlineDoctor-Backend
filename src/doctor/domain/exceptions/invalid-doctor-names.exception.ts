import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorNamesException extends DomainException {
    constructor() { super("Nombres del doctor inválidos."); }
}