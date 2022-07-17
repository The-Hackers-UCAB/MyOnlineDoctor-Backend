import { DomainEvent } from "../../domain/domain-events/domain-event";
import { ISubscription } from "./subscription.interface";

/**IEventHandler es una interfaz utilizada para el manejo de eventos de dominio. */
export interface IEventHandler {
    /**Publica un conjunto de eventos de dominio.
     * @param events Eventos a publicar.*/
    publish(events: DomainEvent[]): Promise<void>;

    /**Permite agregar un nuevo suscriptor.
     * @param eventName Nombre del evento de dominio.
     * @param next Método a invocar cuando el evento especificado es publicado.*/
    subscribe<T extends DomainEvent>(eventName: string, next: (event: T) => void): Promise<ISubscription>;
}
