/** IValueObject: Es una interfaz genérica utilizada para implementar Value Objects.
 *  @typeParam `T` Tipo del parametro del Value Object*/
export interface IValueObject<T> {
    /**
     * Compara la igualdad de dos Value Objects
     * @param other Value Object a comparar.
     * @returns `boolean`*/
    equals(other: T): boolean;
}
