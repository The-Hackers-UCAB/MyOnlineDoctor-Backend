import { DomainEvent } from "../../../../../core/domain/domain-events/domain-event";
import { ILogger } from "../../../../../core/application/logging-handler/logger.interface";
import { IEventHandler } from "../../event-handler.interface";
import { EventHandlerDecorator } from "../event-handler.decorator";

/**LoggingEventHandlerDecorator: Es una clase abstracta genérica utilizada para implementar logging en los eventos.*/
export class LoggingEventHandlerDecorator extends EventHandlerDecorator {
    private readonly logger: ILogger;

    constructor(eventHandler: IEventHandler, logger: ILogger) {
        super(eventHandler);
        this.logger = logger;
    }

    async publish(events: DomainEvent[]): Promise<void> {
        this.logger.log(
            this.constructor.name,
            "Eventos de Dominio: " + JSON.stringify(events)
        );

        await super.publish(events);
    }
}
