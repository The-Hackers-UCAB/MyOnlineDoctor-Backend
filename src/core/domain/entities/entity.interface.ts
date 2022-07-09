/** IEntity: Es una interfaz genérica utilizada para implementar Entidades de dominio.
 *  @typeParam `T` Tipo del parametro de la entidad*/
export interface IEntity<T> {
    /**Compara la igualdad de dos Entidades
     * @param other Entidades a comparar.
     * @returns `boolean`*/
    equals(other: T): boolean;
}