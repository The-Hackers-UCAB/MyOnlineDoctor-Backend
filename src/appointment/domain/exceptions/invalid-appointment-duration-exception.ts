import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidDurationAppointmentException extends DomainException {
    constructor() { super("Duracion de la cita inválida.") }
}