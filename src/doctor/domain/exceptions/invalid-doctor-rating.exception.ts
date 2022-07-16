import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidDoctorRatingException extends DomainException {
    constructor() { super("Calificación del doctor inválida."); }
}