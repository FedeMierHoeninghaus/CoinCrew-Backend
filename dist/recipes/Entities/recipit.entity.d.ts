export interface ReciptEntity {
    id: number;
    user_id: number;
    monto: number;
    tipo_moneda: RecipitCurrency;
    descripcion: string;
    image_url: string;
    created_at: Date;
}
export declare enum RecipitCurrency {
    PESOS = "pesos",
    DOLARES = "dolares"
}
export declare enum RecipitStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
