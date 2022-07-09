import { BadRequestException, ConflictException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";

/** UsersRepository: Es un repositorio de infraestructura utilizado para el acceso a los datos de persistencia de la entidad de UserEntity */
@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async comparePasswords(password: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, userPassword);
    }

    async saveUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userEntity = await this.create({ email: createUserDto.email, password: createUserDto.password });

        try {
            return await this.save(userEntity);
        }
        catch (error) {
            if (error.code == 23505) throw new ConflictException('Este correo ya se encuentra registrado.');
            throw new BadRequestException('ERROR: ' + error.code);
        }
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return await this.findOne({ where: { email } });
    }

    async findOneById(id: number): Promise<UserEntity> {
        return await this.findOneOrFail({ where: { id } });
    }

    async findOneOrFailByEmail(email: string): Promise<UserEntity> {
        const userEntity = await this.findOne({ where: { email } });
        if (!userEntity) throw new BadRequestException('Este correo no se encuentra registrado.');
        return userEntity;
    }

    async findOneOrFailById(id: number): Promise<UserEntity> {
        const userEntity = await this.findOneOrFail({ where: { id } });
        if (!userEntity) throw new BadRequestException('No se ha encontrado al usuario.');
        return userEntity;
    }
}