import { ICallable } from "./callable.interface";

/**ISubscriber: Es una interfaz que permite almacenar las funciones invocables de un suscriptor.*/
export interface ISubscriber {
    [key: string]: ICallable;
}
