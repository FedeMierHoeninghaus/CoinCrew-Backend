import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class loginDto{
    @IsEmail()
    @IsNotEmpty({message: 'El email es requerido'})
    @IsString()
    email:string;

    @IsNotEmpty({message: 'La contraseña es requerida'})
    @IsString()
    password:string;
}