import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorSpecialtyException extends DomainException {
    constructor() { super("Especialidad del doctor inválida."); }
}