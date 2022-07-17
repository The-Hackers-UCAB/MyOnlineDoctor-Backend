import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidDescriptionAppointmentException extends DomainException {
    constructor() { super("Descripción de la cita inválida.") }
}