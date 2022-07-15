import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorIdException extends DomainException {
    constructor() { super("ID del doctor inválido."); }
}