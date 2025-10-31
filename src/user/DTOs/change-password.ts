import { IsNotEmpty, IsString } from "class-validator";
export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty({message: 'La contraseña actual es requerida'})
    currentPassword: string;

    @IsString()
    @IsNotEmpty({message: 'La nueva contraseña es requerida'})
    newPassword: string;
}