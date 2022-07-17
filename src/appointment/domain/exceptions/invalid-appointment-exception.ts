import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class InvalidAppointmentException extends DomainException {
    constructor() { super("Cita inválida."); }
}