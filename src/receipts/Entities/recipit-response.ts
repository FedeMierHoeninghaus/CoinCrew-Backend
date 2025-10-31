import { ReceiptCurrency } from "../entities/receipt.entity";

export class ReciptResponseDto {
    id: number;
    monto: number;
    tipo_moneda: ReceiptCurrency;
    descripcion: string;
    image_url: string;
    created_at: Date;
}