import { ReceiptCurrency } from '../entities/receipt.entity';
export declare class CreateReceiptDto {
    monto: number;
    tipo_moneda: ReceiptCurrency;
    descripcion: string;
    image_url: string;
}
