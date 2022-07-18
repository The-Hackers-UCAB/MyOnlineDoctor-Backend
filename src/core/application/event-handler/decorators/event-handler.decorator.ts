import { DomainEvent } from "../../../domain/events/domain-event";
import { IEventHandler } from "../event-handler.interface";
import { ISubscription } from "../subscription.interface";

/**EventHandlerDecorator: Es una clase abstracta genérica utilizada para implementar el patron decorador en el controlador de eventos.*/
export abstract class EventHandlerDecorator implements IEventHandler {
    private readonly eventHandler: IEventHandler;

    constructor(eventHandler: IEventHandler) {
        if (eventHandler == null) { throw new Error(this.constructor.name + ": " + this.constructor.name + " is null. "); }
        this.eventHandler = eventHandler;
    }

    async publish(events: DomainEvent[]): Promise<void> {
        await this.eventHandler.publish(events);
    }

    async subscribe<T extends DomainEvent>(event: string, callback: (event: T) => void): Promise<ISubscription> {
        return await this.eventHandler.subscribe(event, callback);
    }
}