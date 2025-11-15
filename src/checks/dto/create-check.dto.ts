import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, Min, IsPositive } from "class-validator";
import { Currency } from "src/common/enums/currency.enum";

export class CreateCheckDto {
    @IsEnum(Currency)
    currency: Currency;

    @IsDateString()
    purchase_date: Date;

    @IsDateString()
    maturity_date: Date;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    purchase_price: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    face_value: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Min(0)
    platform_fee?: number = 0;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    transfer_fee?: number = 0;

    @IsOptional()
    issuer?: string;
}
