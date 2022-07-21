import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, InternalServerErrorException, Post, Request, UseGuards } from '@nestjs/common';
import { SessionGuard } from './sessions/session.guard';
import { LocalAuthGuard } from './strategies/local.auth.guard';
import { tap } from 'rxjs';

/** AuthController: Controller de infraestructura encargado de gestionar las peticiones relacionadas con el módulo de seguridad.*/
@Controller('auth')
export class AuthController {

    private readonly httpService: HttpService = new HttpService();

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() request): Promise<{ value: string }> {
        return { value: "Sesión iniciada." };
    }

    @Post('doctor/login')
    async loginDoctor(@Body() body) {
        let cookie = "";
        await this.httpService.post(
            process.env.CURRENT_URL + "" + '/api/auth/login',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).pipe(
            tap({
                next: (response) => {
                    cookie = response?.headers['set-cookie'][0];
                },
                error: (error) => {
                    throw new InternalServerErrorException();
                }
            })
        ).toPromise();

        return cookie;
    }

    @Get('logout')
    @UseGuards(SessionGuard)
    async logout(@Request() request): Promise<{ value: string }> {
        request.session.destroy();
        return { value: "Sessión cerrada." };
    }
}
