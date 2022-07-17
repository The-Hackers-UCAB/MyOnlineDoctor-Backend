import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidDateAppointmentException extends DomainException {
    constructor() { super("Fecha de la cita inválida.") }
}