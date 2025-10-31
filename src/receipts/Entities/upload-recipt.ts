import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UploadReciptDto {
    @IsNotEmpty({message: 'El recibo es requerido'})
    @IsNumber()
    monto: number;

    @IsNotEmpty({message: 'El tipo de moneda es requerido'})
    @IsString()
    tipo_moneda: 'pesos' | 'dolares';

    @IsNotEmpty({message: 'La descripción es requerida'})
    @IsString()
    descripcion: string;
}