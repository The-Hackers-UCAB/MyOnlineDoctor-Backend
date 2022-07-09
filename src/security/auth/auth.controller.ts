import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UsersRepository } from '../users/entities/repositories/users.repository';
import { UserEntity } from '../users/entities/user.entity';
import { SessionGuard } from './sessions/session.guard';
import { LocalAuthGuard } from './strategies/local.auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly manager: EntityManager) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() request): Promise<{ msg: string }> {
        return { msg: "Logged in!" };
    }

    @Get('logout')
    @UseGuards(SessionGuard)
    async logout(@Request() request): Promise<{ msg: string }> {
        request.session.destroy();
        return { msg: "Logged out!" };
    }

    @Post('create')
    async createUser(@Body() dto: any) {
        const usersRepository = new UsersRepository(this.manager.getRepository(UserEntity));
        usersRepository.saveUser(dto.email, dto.password);
    }
}
