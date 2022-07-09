import { DomainEvent } from "../../domain/domain-events/domain-event";

export interface IEventBus {
    publish(events: DomainEvent[]): void
}
