import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorSurnamesException extends DomainException {
    constructor() { super("Apellidos del doctor inválidos."); }
}