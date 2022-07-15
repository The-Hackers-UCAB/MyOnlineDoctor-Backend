import { DomainEvent } from "../domain-events/domain-event"
import { Entity } from "../entities/entity";
import { IValueObject } from "../value-objects/value-object.interface";

/** AggregateRoot: Es una clase abstracta y genérica utilizada para implementar Agregados del dominio.
 *  @typeParam `T` Tipo paramtrizado del ID de la entidad. Debe extender de IValueObject.*/
export abstract class AggregateRoot<T extends IValueObject<T>> extends Entity<T> {
    /**Eventos de dominio que han modificado el estado del agregado. */
    protected events: DomainEvent[] = [];

    /**Constructor del agregado.
     * @param id ID de la entidad del agregado.
     * @param event Evento con los cambios. */
    protected constructor(id: T, event: DomainEvent) {
        super(id);
        this.ensureValidState();
        this.events.push(event);
    }

    /**Retorna y elimina todos los cambios realizados en el aggregate root.
     * @returns Cambios ocurridos en el aggregate root. */
    public pullEvents(): DomainEvent[] {
        const result = this.events;
        this.events = [];
        return result;
    }

    /**Permite cambiar el estado del agregado en función de un evento de dominio.
     * @param event Nuevo estado del agregado. */
    protected apply(event: DomainEvent): void {
        this.when(event);
        this.ensureValidState();
        this.events.push(event);
    }

    /**Realiza los cambios en los atributos del agregado según el evento. 
     * @param event Nuevo estado del agregado. */
    protected abstract when(event: DomainEvent): void;

    /**Valida que el nuevo estado del agregado sea válido.*/
    protected abstract ensureValidState(): void;
}
