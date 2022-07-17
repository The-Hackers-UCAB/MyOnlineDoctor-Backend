import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length } from "class-validator";
import { Role } from "../roles/role.entity.enum";

/** CreateUserDto: Es un DTO de infraestructura utilizado para registrar un nuevo UserEntity. */
export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @Length(6, 100)
    readonly password: string;

    @IsEnum(Role)
    @IsOptional()
    role: Role;

    patientId?: string;

    doctorId?: string;
}