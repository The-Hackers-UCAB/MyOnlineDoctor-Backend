import { DomainEvent } from "../domain-events/domain-event"
import { IEntity } from "../entities/entity.interface";

export abstract class AggregateRoot<T> implements IEntity<T> {
    private events: DomainEvent[] = []

    protected addEvent(event: DomainEvent): void {
        this.events.push(event)
    }

    public pullEvents(): DomainEvent[] {
        const result = this.events;
        this.events = [];
        return result;
    }

    abstract equals(other: T): boolean;
}
