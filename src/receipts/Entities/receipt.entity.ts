export interface ReceiptEntity {
    id: number;
    user_id: number;
    monto: number;
    tipo_moneda: ReceiptCurrency;
    descripcion: string;
    image_url: string;
    created_at: Date;
}

export enum ReceiptCurrency {
    PESOS = 'pesos',
    DOLARES = 'dolares'
} 