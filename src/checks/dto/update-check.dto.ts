import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckDto } from './create-check.dto';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { CheckStatus } from 'src/common/enums/check-status';
import { Type } from 'class-transformer';

export class UpdateCheckDto extends PartialType(CreateCheckDto) {
    @IsString()
    @IsEnum(CheckStatus)
    @IsOptional()
    status: CheckStatus;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    platform_fee?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    transfer_fee?: number;

    @IsDateString()
    @IsOptional()
    settled_date?: Date;

    @IsDateString()
    @IsOptional()
    maturity_date?: Date; //para el caso de las facturas

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    recovered_amount?: number;
}
