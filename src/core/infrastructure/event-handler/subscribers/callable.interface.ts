/**ICallable: Es una interfaz que permite almacenar funciones a invocar.*/
export interface ICallable {
    [key: string]: Function;
}