import { DomainException } from "../../../core/domain/exceptions/domain.exception";

export class PatientNotActiveException extends DomainException {
    constructor() { super("Paciente suspendido."); }
}