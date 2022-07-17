import { DomainException } from "../../../core/domain/exceptions/domain.exception";


export class InvalidDoctorAppointmentException extends DomainException {
    constructor() { super("Doctor de la cita inválido.") }
}