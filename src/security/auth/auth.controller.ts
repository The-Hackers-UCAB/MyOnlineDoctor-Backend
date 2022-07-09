import { Controller, Get, Post, Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post('login')
    async login(@Request() request): Promise<{ msg: string }> {
        return { msg: "Logged in!" };
    }

    @Get('logout')
    async logout(@Request() request): Promise<{ msg: string }> {
        request.session.destroy();
        return { msg: "Logged out!" };
    }
}
