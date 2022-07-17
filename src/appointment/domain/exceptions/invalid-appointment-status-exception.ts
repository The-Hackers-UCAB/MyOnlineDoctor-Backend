import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidStatusAppointmentException extends DomainException {
    constructor() { super("Estatus de la cita inválido.") }
}