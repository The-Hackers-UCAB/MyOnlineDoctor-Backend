import { IValueObject } from "../value-objects/value-object.interface";

/** Entity: Es una clase abstracta y genérica utilizada para implementar Entidades del dominio.
 *  @typeParam `T` Tipo paramtrizado del ID de la entidad. Debe extender de IValueObject.*/
export abstract class Entity<T extends IValueObject<T>> {
    /** Identificador único de la entidad. */
    private readonly id: T;

    /**Constructor de la entidad.
     * @param id Identificador único de la entidad. */
    protected constructor(id: T) {
        this.id = id;
    }

    /** ID: Getter del identificador único de la entidad. */
    get ID() { return this.id; }

    /**Compara la igualdad entre dos Entidades en función de sus IDs.
     * @param otherID ID de la entidad a compara.
     * @returns `boolean`*/
    equals(otherID: T): boolean {
        return this.id.equals(otherID);
    }
}