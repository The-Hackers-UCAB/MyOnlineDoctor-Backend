import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getManager } from 'typeorm';
import { UsersRepository } from '../users/entities/repositories/users.repository';

@Injectable()
export class AuthService {
    async validateUser(email: string, password: string) {
        const usersRepository = await getManager().getCustomRepository(UsersRepository);
        const userEntity = await usersRepository.findOneByEmail(email);

        if (await usersRepository.comparePasswords(password, userEntity.password)) {
            const { password, ...userDto } = userEntity;
            return userDto;
        }

        throw new UnauthorizedException("Credenciales inválidas.");
    }
}
