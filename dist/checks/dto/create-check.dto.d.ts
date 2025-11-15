import { Currency } from "src/common/enums/currency.enum";
export declare class CreateCheckDto {
    currency: Currency;
    purchase_date: Date;
    maturity_date: Date;
    purchase_price: number;
    face_value: number;
    platform_fee?: number;
    transfer_fee?: number;
    issuer?: string;
}
