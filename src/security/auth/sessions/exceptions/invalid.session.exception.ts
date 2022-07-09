import { ForbiddenException } from "@nestjs/common";

/** InvalidSessionException is a custom Nestjs exception for invalidated sessions.*/
export class InvalidSessionException extends ForbiddenException {
    constructor() {
        super('Sessión cerrada.');
    }
}