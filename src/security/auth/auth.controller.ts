import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SessionGuard } from './sessions/session.guard';
import { LocalAuthGuard } from './strategies/local.auth.guard';

/** AuthController: Controller de infraestructura encargado de gestionar las peticiones relacionadas con el módulo de seguridad.*/
@Controller('auth')
export class AuthController {
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() request): Promise<{ value: string }> {
        return { value: "Sesión iniciada." };
    }

    @Get('logout')
    @UseGuards(SessionGuard)
    async logout(@Request() request): Promise<{ value: string }> {
        request.session.destroy();
        return { value: "Sessión cerrada." };
    }
}
