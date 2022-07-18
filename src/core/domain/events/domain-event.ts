/** DomainEvent: Es una clase concreta utilizada para implementar eventos del dominio.*/
export abstract class DomainEvent {
    private timestamp: Date;

    /**Momento en el que el evento fue creado. */
    get Timestamp() { return this.timestamp; }

    protected constructor() {
        this.timestamp = new Date();
    }

    /**Retorna el nombre del evento.
     * @returns String con el nombre de la clase. */
    public static eventName(): string { return this.prototype.constructor.name; }
}