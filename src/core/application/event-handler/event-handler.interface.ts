import { DomainEvent } from "../../domain/domain-events/domain-event";

/**IEventHandler es una interfaz utilizada para el manejo de eventos de dominio. */
export interface IEventHandler {
    /**Publica los eventos suministrados.
     * @param events Eventos a publicar por el canal.*/
    publish(events: DomainEvent[]): Promise<void>;
}
