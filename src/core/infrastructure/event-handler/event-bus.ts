import { ISubscription } from "../../application/event-handler/subscription.interface";
import { DomainEvent } from "../../domain/events/domain-event";
import { IEventHandler } from "../../../core/application/event-handler/event-handler.interface";
import { ISubscriber } from "./subscribers/subscriber.interface";
import { LoggingEventHandlerDecorator } from "../../../core/application/event-handler/decorators/logging-decorator/logging-event-handler.decorator";
import { NestLogger } from "../logger/nest-logger";

/**EventBus: Es una clase tipo IEventHandler que se utiliza para implementar un bus de eventos, de forma tal 
 * que se puedan comunicar diferentes componentes a través de eventos de forma desacoplada.*/
export class EventBus implements IEventHandler {
    private static instance?: IEventHandler = undefined;
    private subscribers: ISubscriber;
    private static nextId = 0;

    //Inicializamos los suscriptores.
    private constructor() {
        this.subscribers = {};
    }

    /**Avanza una posición en el array de suscripciones.
     * @returns Siguiente ID */
    private getNextId(): number {
        return EventBus.nextId++;
    }

    /**Patron Singleton.
     * @returns Retorna una instancia del Bus de Eventos con Logging.*/
    public static getInstance(): IEventHandler {
        return this.instance = new LoggingEventHandlerDecorator(
            new EventBus(),
            new NestLogger()
        );;
    }

    async publish(events: DomainEvent[]): Promise<void> {
        events.forEach(event => {
            //Obtenemos las funciones suscritas en función del evento invocado.
            const subscriber = this.subscribers[event.constructor.name];

            if (subscriber) {
                //Por cada función suscrita se invoca el método y se pasa el evento.
                Object.keys(subscriber).forEach((key) => subscriber[key](event));
            }
        });
    }

    async subscribe<T extends DomainEvent>(eventName: string, next: (event: T) => void): Promise<ISubscription> {
        //Tomamos el siguiente ID
        const id = this.getNextId();

        //Si aún no existe un suscriptor para dicho evento se crea uno nuevo.
        if (!this.subscribers[eventName]) this.subscribers[eventName] = {};

        //Suscribimos la función a invocar con el nombre del evento.
        this.subscribers[eventName][id] = next;

        //Retornamos una suscripción con los valores e implementación de la desuscripción.
        return {
            unregister: () => {
                delete this.subscribers[eventName][id];
                if (Object.keys(this.subscribers[eventName]).length === 0)
                    delete this.subscribers[eventName];
            },
        };
    }
}