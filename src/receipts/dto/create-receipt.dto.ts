import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { ReceiptCurrency } from '../entities/receipt.entity';

export class CreateReceiptDto {
    @IsNotEmpty({ message: 'El monto es requerido' })
    @IsNumber({}, { message: 'El monto debe ser un número' })
    monto: number;

    @IsNotEmpty({ message: 'El tipo de moneda es requerido' })
    @IsEnum(ReceiptCurrency, { message: 'El tipo de moneda debe ser pesos o dolares' })
    tipo_moneda: ReceiptCurrency;

    @IsNotEmpty({ message: 'La descripción es requerida' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion: string;

    @IsNotEmpty({ message: 'La URL de la imagen es requerida' })
    @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
    image_url: string;
} 