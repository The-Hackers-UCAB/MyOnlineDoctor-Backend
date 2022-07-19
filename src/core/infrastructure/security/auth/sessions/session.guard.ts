import { CanActivate, ExecutionContext } from "@nestjs/common";
import { InvalidSessionException } from "./exceptions/invalid.session.exception";

export class SessionGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.isAuthenticated()) throw new InvalidSessionException();
        return true;
    }
}