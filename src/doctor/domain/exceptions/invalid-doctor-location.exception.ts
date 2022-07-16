import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorLocationException extends DomainException {
    constructor() { super("Locación del doctor inválidos."); }
}