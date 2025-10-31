import { RecipitCurrency } from "./recipit.entity";
export declare class ReciptResponseDto {
    id: number;
    monto: number;
    tipo_moneda: RecipitCurrency;
    descripcion: string;
    image_url: string;
    created_at: Date;
}
