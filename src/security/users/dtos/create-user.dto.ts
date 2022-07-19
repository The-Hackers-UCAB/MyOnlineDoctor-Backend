import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
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

    @IsString()
    @IsOptional()
    firebaseToken?: string;

    patientId?: string;

    doctorId?: string;
}