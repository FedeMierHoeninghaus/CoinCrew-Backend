import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({message: 'El email es requerido'})
    @IsString()
    mail: string;

    @IsString()
    @IsNotEmpty({message: 'La contraseña es requerida'})
    password: string;
}