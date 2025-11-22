import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionForUserDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsEnum(['UYU', 'USD'])
    currency: 'UYU' | 'USD';

    @IsEnum(['CONTRIBUTION', 'WITHDRAWAL'])
    type: 'CONTRIBUTION' | 'WITHDRAWAL';

    @Type(() => Number)
    @IsNumber()
    amount: number;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
