import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidTypeAppointmentException extends DomainException {
    constructor() { super("Tipo de la cita inválido.") }
}