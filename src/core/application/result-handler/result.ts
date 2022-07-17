/** Result: Es una clase genérica utilizada para encapsular los resultados obtenidos de los CU.
 *  @typeParam `T` Tipo parametrizado del resultado encapsulado.*/
export class Result<T>{
    private value: T;
    private error: Error;

    private constructor(value: T, error: Error) {
        this.value = value;
        this.error = error;
    }

    /** Retorna el valor del resultado encapsulado. */
    get Value(): T {
        return this.value;
    }

    /** Retorna el error encapsulado. */
    get Error(): Error {
        return this.error;
    }

    /** Retorna `true` si el resultado fue exitoso, en caso contrario `false`. */
    get IsSuccess(): boolean {
        return !this.error
    }

    /**Crea un objeto result exitoso con su valor.
     * @param error Excepción encapsulada
     * @returns Result */
    static success<T>(value: T): Result<T> {
        return new Result(value, null);
    }

    /**Crea un objeto result de falla.
     * @param error Excepción encapsulada
     * @returns Result */
    static fail<T>(error: Error): Result<T> {
        return new Result<T>(null, error);
    }
}