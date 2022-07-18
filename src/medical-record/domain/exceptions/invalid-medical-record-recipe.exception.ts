import { DomainException } from "src/core/domain/exceptions/domain.exception";

export class InvalidMedicalRecordRecipeException extends DomainException{
    constructor(){ super("Recipe del Medical Record inválido."); }
}