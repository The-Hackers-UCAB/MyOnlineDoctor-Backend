import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidPatientAppointmentException extends DomainException {
    constructor() { super("Paciente de la cita inválido.") }
}