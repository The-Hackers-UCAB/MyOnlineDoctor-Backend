/**DomainException: Es una clase abstracta utilizada para el manejo de excepciones del dominio.*/
export abstract class DomainException extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, DomainException.prototype);
    }
}