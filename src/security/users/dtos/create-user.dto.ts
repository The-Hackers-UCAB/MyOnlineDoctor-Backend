import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @Length(8, 100)
    readonly password: string;
}