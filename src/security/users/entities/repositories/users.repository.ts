import { BadRequestException, ConflictException } from "@nestjs/common";
import { UserEntity } from "../user.entity";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";

export class UsersRepository {

    constructor(private readonly manager: Repository<UserEntity>) { }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    async comparePasswords(password: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, userPassword);
    }

    async saveUser(email: string, password: string): Promise<UserEntity> {
        const userEntity = await this.manager.create({ email, password: await this.hashPassword(password) });

        try {
            return await this.manager.save(userEntity);
        }
        catch (error) {
            if (error.code == 23505) throw new ConflictException('Este correo ya se encuentra registrado.');
            throw new BadRequestException('ERROR: ' + error.code);
        }
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return await this.manager.findOne({ where: { email } });
    }

    async findOneById(id: number): Promise<UserEntity> {
        return await this.manager.findOneOrFail({ where: { id } });
    }
}