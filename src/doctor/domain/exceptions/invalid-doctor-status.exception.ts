import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorStatusException extends DomainException {
    constructor() { super("Status del doctor inválido."); }
}