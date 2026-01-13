import { CreateCheckDto } from './create-check.dto';
import { CheckStatus } from 'src/common/enums/check-status';
declare const UpdateCheckDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCheckDto>>;
export declare class UpdateCheckDto extends UpdateCheckDto_base {
    status: CheckStatus;
    platform_fee?: number;
    transfer_fee?: number;
    settled_date?: Date;
    maturity_date?: Date;
    resguardo_irp_de_facturas?: number;
    irpf?: number;
    recovered_amount?: number;
}
export {};
