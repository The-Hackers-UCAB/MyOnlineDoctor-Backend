import { DomainEvent } from "../../../../core/domain/domain-events/domain-event";
import { IEventHandler } from "../event-handler.interface";

/**EventHandlerDecorator: Es una clase abstracta genérica utilizada para implementar el patron decorador en el controlador de eventos.*/
export abstract class EventHandlerDecorator implements IEventHandler {
    private readonly eventHandler: IEventHandler;

    constructor(eventHandler: IEventHandler) {
        if (eventHandler == null) { throw new Error(this.constructor.name + ": " + this.constructor.name + " is null. "); }
        this.eventHandler = eventHandler;
    }

    async publish(events: DomainEvent[]): Promise<void> {
        this.eventHandler.publish(events);
    }
}