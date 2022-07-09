import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UsersRepository } from '../users/entities/repositories/users.repository';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

    private readonly usersRepository: UsersRepository;

    constructor(private readonly manager: EntityManager) {
        this.usersRepository = new UsersRepository(this.manager.getRepository(UserEntity));
    }

    async validateUser(email: string, password: string) {
        const userEntity = await this.usersRepository.findOneByEmail(email);

        if (await this.usersRepository.comparePasswords(password, userEntity.password)) {
            const { password, ...userDto } = userEntity;
            return userDto;
        }

        throw new UnauthorizedException("Credenciales inválidas.");
    }
}
