import { ForbiddenException } from "@nestjs/common";

/** InvalidSessionException: Excepción de NestJs para sesiones inválidas.*/
export class InvalidSessionException extends ForbiddenException {
    constructor() {
        super('Sesión cerrada.');
    }
}