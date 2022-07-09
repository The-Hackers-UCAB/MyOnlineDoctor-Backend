/** DomainEvent: Es una clase concreta utilizada para implementar eventos del dominio.*/
export class DomainEvent {
    private name: string;
    private timestamp: Date;
    private payload: any;

    get Name() { return this.name; }
    get Timestamp() { return this.timestamp; }
    get Payload() { return this.payload; }

    private constructor(name, payload) {
        this.name = name;
        this.timestamp = new Date();
        this.payload = payload;
    }

    /**
     * Patron Factory.
     * @param name Nombre del evento.
     * @param payload Información del evento.
     * @returns `DomainEvent` */
    public static create(name, payload): DomainEvent {
        if (name == null || name == undefined || name == '') {
            throw new Error("El nombre de un evento no puede ser undefined o null.");
        }

        if (payload == null || payload == undefined) {
            throw new Error("La información de un evento no puede ser undefined o null.");
        }

        return new DomainEvent(name, payload);
    }
}