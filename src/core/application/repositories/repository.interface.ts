/** IRepository: Es una interfaz genérica utilizada para implementar permanencia.
 *  @typeParam `T` Tipo del parametro de la entidad*/
export interface IRepository<T> {
    save(entity: T): Promise<void>;
}