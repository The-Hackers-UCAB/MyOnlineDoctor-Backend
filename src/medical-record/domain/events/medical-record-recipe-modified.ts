import { DomainEvent } from "../../../../src/core/domain/events/domain-event";
import { MedicalRecordID } from "../value-objects/medical-record-id";
import { MedicalRecordRecipe } from "../value-objects/medical-record-recipe";

export class MedicalRecordRecipeModified extends DomainEvent{

    protected constructor(
        public id: MedicalRecordID,
        public recipe: MedicalRecordRecipe
    ){
        super();
    }

    static create(
        id: MedicalRecordID,
        recipe: MedicalRecordRecipe
    ): MedicalRecordRecipeModified{
        return new MedicalRecordRecipeModified(id,recipe);
    }
}