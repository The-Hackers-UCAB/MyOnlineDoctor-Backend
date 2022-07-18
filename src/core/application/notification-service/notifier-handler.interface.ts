
/**
 * Adaptador de Firebase Messaging para enviar notifiaciones
 */
 export interface INotifierHandler<T>{
    sendNotification(payload : T): Promise<void>;
}