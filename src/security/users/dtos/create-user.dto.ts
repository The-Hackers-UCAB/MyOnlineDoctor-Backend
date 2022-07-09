import { IsEmail, IsNotEmpty, Length } from "class-validator";

/** CreateUserDto: Es un DTO de infraestructura utilizado para registrar un nuevo UserEntity. */
export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @Length(8, 100)
    readonly password: string;
}