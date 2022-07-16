import { IValueObject } from "../../../core/domain/value-objects/value-object.interface";
import { AggregateRoot } from "../../../core/domain/aggregates/aggregate-root";

/** IRepository: Es una interfaz genérica utilizada para implementar permanencia.
 *  @typeParam `I` Tipo del parametro del identificador del agregado.
 *  @typeParam `A` Tipo del parametro del agregado*/
export interface IRepository<I extends IValueObject<I>, A extends AggregateRoot<I>> {
    /**Persiste un agregado.
     * @param aggregate Agregado a persistir.*/
    saveAggregate(aggregate: A): Promise<void>;

    /**Busca el agregado según su identificador único.
     * @param id Identificador del agregado. */
    findOneById(id: I): Promise<A>;
}