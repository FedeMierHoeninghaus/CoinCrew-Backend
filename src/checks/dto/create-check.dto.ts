import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, Min, IsPositive, ValidateBy, ValidationArguments } from "class-validator";
import { Currency } from "src/common/enums/currency.enum";

// Validador personalizado para asegurar que face_value >= purchase_price
function IsFaceValueValid(validationOptions?: any) {
  return ValidateBy({
    name: 'isFaceValueValid',
    validator: {
      validate(value: any, args: ValidationArguments) {
        const object = args.object as any;
        const faceValue = Number(value);
        const purchasePrice = Number(object.purchase_price);
        return faceValue >= purchasePrice;
      },
      defaultMessage(args: ValidationArguments) {
        return 'El valor del cheque debe ser mayor o igual al precio de compra';
      }
    },
    ...validationOptions
  });
}

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
    @IsFaceValueValid()
    face_value: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(0)
    platform_fee?: number = 0;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(0)
    transfer_fee?: number = 0;

    @IsOptional()
    issuer?: string;
}
