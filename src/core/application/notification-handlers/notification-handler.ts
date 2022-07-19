/** NotificationHandler: Es una clase abstracta genérica utilizada para implementar manejadores de notificaciones.
 *  @typeParam `D` Tipo parametrizado de la data que recibe al ejecutarse la función de mandar notificación.
 *  @typeParam `M` Tipo parametrizado de la data que maneja cada implementación */
export abstract class NotificationHandler<D, M> {
    /**Constructor del notifier.
     * @param messageMapper Función que permite mappear la data de tipo D a M.*/
    constructor(protected messageMapper: (data: D) => Promise<M>) { }

    /**Permite enviar una notificación en función de una data.
     * @param data Data de utilizada para enviar la notifiación. */
    abstract send(data: D): Promise<void>;
}