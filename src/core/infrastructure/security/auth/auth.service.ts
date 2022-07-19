import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getManager } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { UsersRepository } from '../users/repositories/users.repository';

/** AuthService: Servicio de infraestructura (NestJs) utilizado para el manejo de seguridad y autenticación. */
@Injectable()
export class AuthService {
    async validateUser(email: string, password: string): Promise<Partial<UserEntity>> {
        const usersRepository = await getManager().getCustomRepository(UsersRepository);
        const userEntity = await usersRepository.findOneOrFailByEmail(email);

        if (await usersRepository.comparePasswords(password, userEntity.password)) {
            const { password, ...userDto } = userEntity;
            return userDto;
        }

        throw new UnauthorizedException("Credenciales inválidas.");
    }
}
