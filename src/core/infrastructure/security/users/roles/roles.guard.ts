import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';
import { Role } from './role.entity.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        const result = requiredRoles.some((role) => user.role?.includes(role));

        if (!result) throw new UnauthorizedException('Privilegios Insuficientes.');

        return result;
    }
}