import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorGenderException extends DomainException {
    constructor() { super("Género del doctor inválido."); }
}