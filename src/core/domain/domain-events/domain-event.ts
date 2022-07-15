/** DomainEvent: Es una clase concreta utilizada para implementar eventos del dominio.*/
export abstract class DomainEvent {
    private timestamp: Date;

    /**Momento en el que el evento fue creado. */
    get Timestamp() { return this.timestamp; }

    protected constructor() {
        this.timestamp = new Date();
    }
}