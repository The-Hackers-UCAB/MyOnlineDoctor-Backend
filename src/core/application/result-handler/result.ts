/** Result: Es una clase genérica utilizada para encapsular los resultados obtenidos de los CU.
 *  @typeParam `T` Tipo parametrizado del resultado encapsulado.*/
export class Result<T>{
    private value: T;
    private error: Error;

    private constructor(value: T)
    private constructor(error: Error)
    private constructor(value: unknown) {
        if (value as Error) {
            this.error = value as Error;
            this.value = null;
        }
        else if (value as T) {
            this.value = value as T;
            this.error = null;
        }
    }

    /** Retorna el valor del resultado encapsulado. */
    get Value(): T {
        return this.value;
    }

    /** Retorna el mensaje del error encapsulado. */
    get Error(): string {
        return this.error.message;
    }

    /** Retorna `true` si el resultado fue exitoso, en caso contrario `false`. */
    get IsSuccess(): boolean {
        return !this.error
    }

    /**Crea un objeto result exitoso con su valor.
     * @param error Excepción encapsulada
     * @returns Result */
    static success<T>(value: T): Result<T> {
        return new Result(value);
    }

    /**Crea un objeto result de falla.
     * @param error Excepción encapsulada
     * @returns Result */
    static fail<T>(error: Error): Result<T> {
        return new Result<T>(error);
    }
}