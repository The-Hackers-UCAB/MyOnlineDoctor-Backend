import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidIdAppointmentException extends DomainException {
    constructor() { super("ID de la cita inválida.") }
}