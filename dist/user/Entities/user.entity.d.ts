export interface UserEntity {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    fondo_pesos: number;
    fondo_dolares: number;
    pago_cuota_mensual: boolean;
    createdAt: Date;
    updatedAt: Date;
}
