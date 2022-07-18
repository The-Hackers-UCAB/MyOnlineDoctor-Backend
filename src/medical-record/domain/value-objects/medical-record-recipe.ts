import { IValueObject } from "src/core/domain/value-objects/value-object.interface";
import { InvalidMedicalRecordRecipeException } from "../exceptions/invalid-medical-record-recipe.exception";

export class MedicalRecordRecipe implements IValueObject<MedicalRecordRecipe>{
    
    private readonly recipe: string;

    get Value(){ 
        return this.recipe;
    }

    private constructor(recipe: string){
        if(recipe){
            this.recipe = recipe;
        }else{
            throw new InvalidMedicalRecordRecipeException();
        }
    }

    equals(other: MedicalRecordRecipe): boolean {
        return this.recipe === other.recipe;
    }

    static create(recipe: string): MedicalRecordRecipe{
        return new MedicalRecordRecipe(recipe);
    }
}